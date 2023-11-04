from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.solve_puzzle_view, name='upload_puzzle'),
]