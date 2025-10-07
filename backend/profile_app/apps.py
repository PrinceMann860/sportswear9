from django.apps import AppConfig


class ProfileAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profile_app'
    default_app_config = "userprofile.apps.UserprofileConfig"
