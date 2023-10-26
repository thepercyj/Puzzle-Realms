from django.urls import path
from . import views

# The routing of the view file is defined and passed as a path inside here.

urlpatterns = [
    path('', views.polysphere, name='polysphere'),
]