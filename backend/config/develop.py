"""
This is the settings file that you use when you're working on the project locally.
Local development-specific include DEBUG mode, log level, and activation of developer tools like django-debug-toolsbar
"""

from .base import *

# # Read dot env file for development builds
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-jq3hf0go!7fw48=%^s+#e@5&*(uufd67w+*_z_7@th6d#&u&c9"

ALLOWED_HOSTS = ["*"]

CORS_ALLOW_ALL_ORIGINS = True

# media files
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")
DUMP_FOLDER = os.getenv("DUMP_FOLDER", BASE_DIR.parent / ".db_dumps")
