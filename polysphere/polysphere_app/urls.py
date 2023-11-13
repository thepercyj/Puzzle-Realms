# urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('submit_kanoodle_problem/', views.submit_kanoodle_problem, name='submit_kanoodle_problem'),
    path('get_kanoodle_solution/<int:problem_id>/', views.get_kanoodle_solution, name='get_kanoodle_solution'),
    path('solutions/', views.generate_solution_gallery, name='generate_solution_gallery'),
    path('find_partial_solutions/', views.find_partial_solutions, name='find_partial_solutions'),
    path('', views.landing, name='landing'),
]
