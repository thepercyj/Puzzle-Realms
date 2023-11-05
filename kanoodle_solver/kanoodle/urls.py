from django.urls import path
from . import views

urlpatterns = [
    # your existing patterns...
    #path('find_solution/', find_solution, name='find_solution'),
    path('kanoodle_solver/', views.kanoodle_solver, name='kanoodle_solver'),
]
