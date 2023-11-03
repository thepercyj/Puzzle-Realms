from django.urls import path
from . import views

app_name = 'polysphere_app'

urlpatterns = [
    path('solve/', views.solve_puzzle_view, name='solve_puzzle'),
]
