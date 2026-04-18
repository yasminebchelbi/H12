from django.urls import path

from .views import chatbot_ask, zones_risk_map

urlpatterns = [
    path('chatbot/ask/', chatbot_ask, name='chatbot-ask'),
    path('zones-risk-map/', zones_risk_map, name='zones-risk-map'),
]
