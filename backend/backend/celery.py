from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Point Celery to Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

# Load settings from Django, with CELERY_ prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# Automatically discover tasks across all installed apps
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
