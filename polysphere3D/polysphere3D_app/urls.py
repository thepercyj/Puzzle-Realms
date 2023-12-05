from django.urls import path
from . import views

urlpatterns = [
    path('', views.ui_template, name='hello_world'),
]
