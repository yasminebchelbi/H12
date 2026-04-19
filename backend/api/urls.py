from django.urls import path

from .views import (
    chatbot_ask,
    fish_analyze,
    seagrass_fusion_predict,
    seagrass_fusion_schema,
    zones_risk_map,
)

urlpatterns = [
    path('chatbot/ask/', chatbot_ask, name='chatbot-ask'),
    path('zones-risk-map/', zones_risk_map, name='zones-risk-map'),
    path('fish-analyze/', fish_analyze, name='fish-analyze'),
    path('seagrass-fusion/', seagrass_fusion_predict, name='seagrass-fusion'),
    path('seagrass-fusion/schema/', seagrass_fusion_schema, name='seagrass-fusion-schema'),
]
