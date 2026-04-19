import logging
import threading

from django.apps import AppConfig

logger = logging.getLogger(__name__)


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self) -> None:
        # Preload fish YOLO in the background so the first /api/fish-analyze/ request is not stuck
        # on Torch/ONNX import + graph warmup (can be tens of seconds on CPU).
        def _preload_fish_model() -> None:
            try:
                from api.yolo_fish import resolve_model_path, get_yolo

                if resolve_model_path():
                    get_yolo()
            except Exception:
                logger.debug("Fish YOLO preload skipped or failed.", exc_info=True)

        threading.Thread(target=_preload_fish_model, daemon=True).start()
