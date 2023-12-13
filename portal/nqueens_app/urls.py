from django.urls import path
from . import views

# The routing of the view file is defined and passed as a path inside here.
app_name = 'nqueens'

urlpatterns = [
    path('nqueens/', views.nqueens, name='nqueens'),
    path('levels/', views.levels, name='levels'),
    path('', views.landing, name='landing'),
]
