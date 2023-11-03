from django.urls import path
from kanoodle.views import find_solution

urlpatterns = [
    # your existing patterns...
    path('find_solution/', find_solution, name='find_solution'),
]
