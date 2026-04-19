import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .gabes_risk import compute_risk_map_points
from .models import ChatbotMessage
from .services import ask_gemini
from .yolo_fish import run_fish_detection
from .seagrass_fusion import run_seagrass_fusion, seagrass_schema


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


@require_GET
def zones_risk_map(request):
	try:
		data = compute_risk_map_points()
	except FileNotFoundError as exc:
		return JsonResponse({'error': str(exc), 'error_code': 'MODEL_NOT_FOUND'}, status=404)
	except Exception as exc:
		return JsonResponse({'error': str(exc), 'error_code': 'RISK_MAP_ERROR'}, status=500)
	return JsonResponse(data)


@csrf_exempt
@require_POST
def fish_analyze(request):
	"""POST multipart: field name `image` — YOLO ONNX fish / disease detection (same logic as YOLO TESTING Flask app)."""
	f = request.FILES.get("image")
	if not f:
		return JsonResponse({"error": "No image file.", "error_code": "NO_FILE"}, status=400)
	try:
		raw = f.read()
		if not raw:
			return JsonResponse({"error": "Empty file.", "error_code": "EMPTY_FILE"}, status=400)
		result = run_fish_detection(raw, f.name)
	except FileNotFoundError as exc:
		return JsonResponse({"error": str(exc), "error_code": "MODEL_NOT_FOUND"}, status=503)
	except ValueError as exc:
		code = str(exc) if exc.args else "BAD_INPUT"
		msg = {
			"UNSUPPORTED_FORMAT": "Unsupported format. Use PNG, JPG, JPEG, BMP, or WEBP.",
			"UNREADABLE_IMAGE": "Could not read this image.",
		}.get(code, "Invalid image.")
		return JsonResponse({"error": msg, "error_code": code}, status=400)
	except Exception as exc:
		return JsonResponse({"error": str(exc), "error_code": "FISH_ANALYZE_ERROR"}, status=500)

	return JsonResponse(result)


@require_GET
def seagrass_fusion_schema(request):
	try:
		return JsonResponse(seagrass_schema())
	except Exception as exc:
		return JsonResponse({"error": str(exc), "error_code": "SEAGRASS_SCHEMA_ERROR"}, status=500)


@csrf_exempt
@require_POST
def seagrass_fusion_predict(request):
	try:
		payload = json.loads(request.body.decode("utf-8"))
	except json.JSONDecodeError:
		return JsonResponse({"error": "Invalid JSON body.", "error_code": "INVALID_JSON"}, status=400)
	try:
		out = run_seagrass_fusion(payload)
	except ValueError as exc:
		code = str(exc)
		msg = {
			"INVALID_PLANT": "plant must be 'posidonia' or 'cymodocea'.",
			"POSIDONIA_VALUES_LEN": "For Posidonia with empty feature_order in config, send posidonia_values: array of 19 numbers.",
			"CYM_FEATURE_LEN": "Wrong number of Cymodocea features.",
			"POS_FEATURE_LEN": "Wrong number of Posidonia features.",
		}.get(code.split(":")[0], code)
		if code.startswith("MISSING_FEATURE:"):
			msg = f"Missing feature: {code.split(':', 1)[1]}"
		return JsonResponse({"error": msg, "error_code": code}, status=400)
	except FileNotFoundError as exc:
		return JsonResponse({"error": str(exc), "error_code": "MODEL_NOT_FOUND"}, status=503)
	except Exception as exc:
		return JsonResponse({"error": str(exc), "error_code": "SEAGRASS_FUSION_ERROR"}, status=500)
	return JsonResponse(out)
