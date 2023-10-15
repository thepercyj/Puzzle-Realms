from django.urls import path
from . import views

urlpatterns = [
    path('chess_board/', views.chess_board, name='chess_board'),

]
