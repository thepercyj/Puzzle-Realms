# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('submit_kanoodle_problem/', views.submit_kanoodle_problem, name='submit_kanoodle_problem'),
    path('get_kanoodle_solution/<int:problem_id>/', views.get_kanoodle_solution, name='get_kanoodle_solution'),
    path('solution/', views.solution_view, name='solution_view'),
]
