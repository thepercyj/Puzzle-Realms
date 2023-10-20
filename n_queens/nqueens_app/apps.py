from django.apps import AppConfig

# Function which calls the application as "nqueens_app" for this Django Project.
class NqueensAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'nqueens_app'
