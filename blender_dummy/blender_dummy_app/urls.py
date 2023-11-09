from django.urls import path
from . import views

urlpatterns = [
    path('solution/', views.display_solution_view, name='solution_view'),
    path('solution_image/', views.solution_image_view, name='solution_image_view'),
]