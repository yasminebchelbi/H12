import json
import os
from pathlib import Path
from urllib import error, request

from django.conf import settings

# Order: try widely available models; on 429 we fall through to the next name.
DEFAULT_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
]


def _candidate_models() -> list[str]:
    configured = os.getenv('GEMINI_MODEL', '').strip()
    if configured:
        return [configured, *DEFAULT_MODELS]
    return DEFAULT_MODELS


def _is_model_not_found(detail: str) -> bool:
    lowered = detail.lower()
    return 'not found' in lowered and 'models/' in lowered


def _answer_from_gemini_json(body: dict) -> str:
    """Turn a Gemini generateContent JSON body into user-visible text."""
    prompt_feedback = body.get('promptFeedback') or {}
    block = prompt_feedback.get('blockReason')
    if block:
        return (
            f'The prompt could not be processed ({block}). '
            'Try rephrasing your question.'
        )

    candidates = body.get('candidates') or []
    if not candidates:
        return 'No answer returned by model.'

    first = candidates[0]
    parts = (first.get('content') or {}).get('parts') or []
    texts = [
        part.get('text', '')
        for part in parts
        if isinstance(part, dict) and part.get('text')
    ]
    joined = '\n'.join(texts).strip()
    if joined:
        return joined

    finish = first.get('finishReason') or ''
    if finish and finish != 'STOP':
        return (
            f'No text in the model response (finish: {finish}). '
            'Try rephrasing your question.'
        )
    return 'No answer text returned by model.'


def _demo_answer(plant_name: str, question: str) -> str:
    return (
        '[Demo mode — Django did not load a real API key]\n\n'
        '1. Put GOOGLE_API_KEY=… in backend/.env (one line, no spaces around =).\n'
        '2. Save the file on disk (Ctrl+S). Unsaved editor tabs are not read by Django.\n'
        '3. Restart runserver.\n\n'
        f'About “{plant_name}”: seagrasses and marine macrophytes stabilize sediments, '
        f'provide nursery habitat for fish, and contribute to coastal oxygen and carbon storage. '
        f'For species-specific ecology or conservation status, use a field guide or regional atlas.\n\n'
        f'Your question: {question}'
    )


def _google_api_key_from_dotenv_files() -> str:
    """Read API key straight from .env files (fallback when os.environ was not populated)."""
    for base in (Path(settings.BASE_DIR), Path(settings.BASE_DIR).parent):
        path = base / '.env'
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding='utf-8-sig')
        except OSError:
            continue
        for raw_line in text.splitlines():
            line = raw_line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            key = key.strip().lstrip('\ufeff')
            if key not in ('GOOGLE_API_KEY', 'GEMINI_API_KEY'):
                continue
            value = value.strip()
            if (value.startswith('"') and value.endswith('"')) or (
                value.startswith("'") and value.endswith("'")
            ):
                value = value[1:-1]
            value = value.strip()
            if value:
                return value
    return ''


def _resolved_google_api_key() -> str:
    """GOOGLE_API_KEY from env, or GEMINI_API_KEY, or .env files; ignores placeholders."""
    raw = (os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY') or '').strip()
    if not raw:
        raw = _google_api_key_from_dotenv_files()
    if not raw:
        return ''
    lowered = raw.lower()
    placeholders = {
        'your_google_api_key_here',
        'changeme',
        'replace_me',
        'paste_your_key_here',
        'xxx',
    }
    if lowered in placeholders:
        return ''
    return raw


def ask_gemini(plant_name: str, question: str) -> str:
    api_key = _resolved_google_api_key()
    if not api_key:
        if settings.DEBUG:
            return _demo_answer(plant_name, question)
        raise RuntimeError('GOOGLE_API_KEY is not configured on the server.')

    prompt = (
        'You are a marine botany assistant. '
        'Explain in a concise and factual way. '
        'If the plant is unknown, say it clearly.\n\n'
        f'Plant: {plant_name}\n'
        f'Question: {question}'
    )

    payload = {
        'contents': [
            {
                'parts': [
                    {'text': prompt}
                ]
            }
        ]
    }

    last_http_error: RuntimeError | None = None

    for model in _candidate_models():
        url = (
            f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
            f'?key={api_key}'
        )
        req = request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'},
            method='POST',
        )

        try:
            with request.urlopen(req, timeout=30) as response:
                body = json.loads(response.read().decode('utf-8'))
                break
        except error.HTTPError as exc:
            detail = exc.read().decode('utf-8', errors='ignore')
            if exc.code == 404 and _is_model_not_found(detail):
                last_http_error = RuntimeError(f'Gemini model unavailable: {model}')
                continue
            # Rate limit / quota: try another model (quotas are often per-model).
            if exc.code == 429 or 'RESOURCE_EXHAUSTED' in detail.upper():
                last_http_error = RuntimeError(
                    f'Gemini API HTTP error {exc.code} for model {model}: {detail}'
                )
                continue
            raise RuntimeError(f'Gemini API HTTP error {exc.code}: {detail}') from exc
        except error.URLError as exc:
            raise RuntimeError(f'Gemini API network error: {exc.reason}') from exc
    else:
        if last_http_error:
            raise last_http_error
        raise RuntimeError('No usable Gemini model found.')

    return _answer_from_gemini_json(body)
