from django.urls import path
from . import views

# The routing of the view file is defined and passed as a path inside here.

urlpatterns = [
    path('', views.game_board, name='game_board'),
]
app_name = 'polysphere_app'

urlpatterns = [
    path('solve/', views.solve_puzzle_view, name='solve_puzzle'),
]
