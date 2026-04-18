import json
import os
from urllib import error, request

DEFAULT_MODELS = [
    'gemini-2.0-flash',
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


def ask_gemini(plant_name: str, question: str) -> str:
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
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
            raise RuntimeError(f'Gemini API HTTP error {exc.code}: {detail}') from exc
        except error.URLError as exc:
            raise RuntimeError(f'Gemini API network error: {exc.reason}') from exc
    else:
        if last_http_error:
            raise last_http_error
        raise RuntimeError('No usable Gemini model found.')

    candidates = body.get('candidates', [])
    if not candidates:
        return 'No answer returned by model.'

    parts = candidates[0].get('content', {}).get('parts', [])
    texts = [part.get('text', '') for part in parts if part.get('text')]
    return '\n'.join(texts).strip() or 'No answer text returned by model.'
