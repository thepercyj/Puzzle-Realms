from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name='landing'),
    path('ui_template/', views.ui_template, name='ui_template'),
]
