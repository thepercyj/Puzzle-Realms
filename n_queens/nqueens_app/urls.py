from django.urls import path
from . import views

urlpatterns = [
    path('nqueens/', views.nqueens, name='nqueens'),
    path('', views.nqueens, name='nqueens_default'),
]
