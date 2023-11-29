# urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('solutions/', views.generate_solution_gallery, name='generate_solution_gallery'),
    path('solutions/find_partial_solutions/', views.find_partial_solutions, name='find_partial_solutions'),
    path('', views.landing, name='landing'),
]
