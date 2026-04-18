import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import ChatbotMessage
from .services import ask_gemini


@csrf_exempt
@require_POST
def chatbot_ask(request):
	try:
		payload = json.loads(request.body.decode('utf-8'))
	except json.JSONDecodeError:
		return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

	plant_name = (payload.get('plant_name') or '').strip()
	question = (payload.get('question') or '').strip()

	if not plant_name:
		return JsonResponse({'error': 'plant_name is required.'}, status=400)
	if not question:
		return JsonResponse({'error': 'question is required.'}, status=400)

	try:
		answer = ask_gemini(plant_name=plant_name, question=question)
	except RuntimeError as exc:
		message = str(exc)
		error_code = 'CHATBOT_UPSTREAM_ERROR'
		if 'GOOGLE_API_KEY' in message:
			error_code = 'MISSING_API_KEY'
		elif 'HTTP error 429' in message or 'RESOURCE_EXHAUSTED' in message or 'quota' in message.lower():
			error_code = 'QUOTA_EXCEEDED'
		return JsonResponse({'error': message, 'error_code': error_code}, status=502)

	saved = ChatbotMessage.objects.create(
		plant_name=plant_name,
		question=question,
		answer=answer,
	)

	return JsonResponse(
		{
			'id': saved.id,
			'plant_name': saved.plant_name,
			'question': saved.question,
			'answer': saved.answer,
			'created_at': saved.created_at.isoformat(),
		},
		status=201,
	)
