from django.urls import path
from . import views

urlpatterns = [
    path('', views.nqueens_board, name='nqueens_board'),

]
