from django.urls import path
from .views import home

urlpatterns = [
    path('', home),  # This maps root URL to home view
]
