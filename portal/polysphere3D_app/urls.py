from django.urls import path
from . import views


urlpatterns = [
    path('ui_template/', views.ui_template, name='ui_template'),
    path('', views.landing, name='landing'),
]
