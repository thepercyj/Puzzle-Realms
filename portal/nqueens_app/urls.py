from django.urls import path
from . import views

# The routing of the view file is defined and passed as a path inside here.
app_name = 'nqueens'

urlpatterns = [
    path('nqueens_doc/', views.nqueens_doc, name='nqueens_doc'),
    path('nqueens_admin_doc/', views.nqueens_admin_doc, name='nqueens_admin_doc'),
    path('nqueens_apps_doc/', views.nqueens_apps_doc, name='nqueens_apps_doc'),
    path('nqueens_models_doc/', views.nqueens_models_doc, name='nqueens_models_doc'),
    path('nqueens_solver_doc/', views.nqueens_solver_doc, name='nqueens_solver_doc'),
    path('nqueens_tests_doc/', views.nqueens_tests_doc, name='nqueens_tests_doc'),
    path('nqueens_urls_doc/', views.nqueens_urls_doc, name='nqueens_urls_doc'),
    path('nqueens_views_doc/', views.nqueens_views_doc, name='nqueens_views_doc'),
    path('nqueens/', views.nqueens, name='nqueens'),
    path('levels/', views.levels, name='levels'),
    path('', views.landing, name='landing'),
]
