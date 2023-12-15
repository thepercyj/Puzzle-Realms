# urls.py
from django.urls import path
from . import views
from django.shortcuts import redirect

app_name = 'polysphere'

urlpatterns = [
    path('polysphere_doc/', views.polysphere_doc, name='polysphere_doc'),
    path('polysphere_admin_doc/', views.polysphere_admin_doc, name='polysphere_admin_doc'),
    path('polysphere_apps_doc/', views.polysphere_apps_doc, name='polysphere_apps_doc'),
    path('polysphere_dlx_doc/', views.polysphere_dlx_doc, name='polysphere_dlx_doc'),
    path('polysphere_kanoodle_doc/', views.polysphere_kanoodle_doc, name='polysphere_kanoodle_doc'),
    path('polysphere_models_doc/', views.polysphere_models_doc, name='polysphere_models_doc'),
    path('polysphere_puzzle_pieces_doc/', views.polysphere_puzzle_pieces_doc, name='polysphere_puzzle_pieces_doc'),
    path('polysphere_tests_doc/', views.polysphere_tests_doc, name='polysphere_tests_doc'),
    path('polysphere_urls_doc/', views.polysphere_urls_doc, name='polysphere_urls_doc'),
    path('polysphere_views_doc/', views.polysphere_views_doc, name='polysphere_views_doc'),
    path('solutions/', views.generate_solution_gallery, name='generate_solution_gallery'),
    path('solutions/find_partial_solutions/', views.find_partial_solutions, name='find_partial_solutions'),
    path('levels/', views.levels, name='levels'),
    path('', views.landing, name='landing'),
]
