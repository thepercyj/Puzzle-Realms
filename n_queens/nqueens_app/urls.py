from django.urls import path
from . import views

# The routing of the view file is defined and passed as a path inside here.

urlpatterns = [
    path('nqueens/', views.nqueens, name='nqueens'),
    path('', views.nqueens, name='nqueens_default'),
]
