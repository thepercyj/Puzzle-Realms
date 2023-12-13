from django.urls import path
from . import views

app_name = 'polysphere3D'

urlpatterns = [
    path('ui_template/', views.ui_template, name='ui_template'),
    path('', views.landing, name='landing'),
]
