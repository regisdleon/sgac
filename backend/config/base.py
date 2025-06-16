import os
import re
from datetime import timedelta
from pathlib import Path

from djangorestframework_camel_case import util
from dotenv import load_dotenv

util.camelize_re = re.compile(r"[a-z0-9]_[a-z0-9]")
import corsheaders.defaults


BASE_DIR = Path(__file__).parent.parent

# Load .env file
load_dotenv(override=True)


DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "django_rest_passwordreset",
    "django_filters",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    "django_extensions",
    "django_cleanup.apps.CleanupConfig",
    "corsheaders",
    "whitenoise.runserver_nostatic",
]

LOCAL_APPS = [
    # aplicaciones del sistema
    "apps.sistema.autenticacion",
    # aplicaciones del negocio
    "apps.negocio.sgac"
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME","sgac"),
        "USER": os.getenv("DB_USER","postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD","postgres"),
        "HOST": os.getenv("DB_HOST","localhost"),
        "PORT": os.getenv("DB_PORT","5432"),
        "TEST": {
            "NAME": "sgac_test",  # optional: Django will use this as the test DB name
            "CHARSET": "UTF8",
        },
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "cache",
    }
}

WSGI_APPLICATION = "config.wsgi.application"

ROOT_URLCONF = "config.urls"
STATIC_URL = "static/"
MEDIA_URL = "media/"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django_session_timeout.middleware.SessionTimeoutMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "djangorestframework_camel_case.middleware.CamelCaseMiddleWare",
]


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "es-es"
TIME_ZONE = "America/Havana"
USE_TZ = True
USE_I18N = True
USE_L10N = False
DATE_FORMAT = "d, m, Y"


REST_FRAMEWORK = {
    # Rendering & Parsing
    "DEFAULT_RENDERER_CLASSES": (
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
        "djangorestframework_camel_case.render.CamelCaseBrowsableAPIRenderer",
    ),
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseFormParser",
        "djangorestframework_camel_case.parser.CamelCaseMultiPartParser",
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
    ),
    # Pagination
    "DEFAULT_PAGINATION_CLASS": "general.paginacion.CustomPageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    # Authentication
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Schema
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Validations
    "NON_FIELD_ERRORS_KEY": "__general__",
}

SPECTACULAR_SETTINGS = {
    "TITLE": "SGAC UNISS API",
    "DESCRIPTION": "Restful API del Sistema de Acreditación de Carreras",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": True,
    # OTHER SETTINGS
    "SWAGGER_UI_DIST": "SIDECAR",  # shorthand to use the sidecar instead
    "SWAGGER_UI_FAVICON_HREF": "SIDECAR",
    "REDOC_DIST": "SIDECAR",
    # available SwaggerUI configuration parameters
    # https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/
    "SWAGGER_UI_SETTINGS": """{
        deepLinking: true,
        persistAuthorization: true,
        displayOperationId: false,
        docExpansion: "none",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout",
        tagsSorter: "alpha",
        operationsSorter: "alpha",
        filter: true,
        displayRequestDuration: true,
        urls: [
            {url: "schema/", name: "schema"},
        ]}
    """,

    "COMPONENT_SPLIT_REQUEST": True,
    # "ENUM_NAME_OVERRIDES": {
    # },
}


AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

CORS_ALLOW_METHODS = corsheaders.defaults.default_methods
CORS_CUSTOM_HEADERS = os.getenv("CORS_CUSTOM_HEADERS", "").split(",")
CORS_ALLOW_HEADERS = corsheaders.defaults.default_headers
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")

if CORS_CUSTOM_HEADERS:
    CORS_ALLOW_HEADERS = (*CORS_ALLOW_HEADERS, *CORS_CUSTOM_HEADERS)

SESSION_EXPIRE_SECONDS = 60 * 60  # 1 hour
SESSION_EXPIRE_AFTER_LAST_ACTIVITY = True
SESSION_EXPIRE_AFTER_LAST_ACTIVITY_GRACE_PERIOD = 60 * 20  # 20 min

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=45),
    "ALGORITHM": "HS256",
}

WEB_APP_BASE_URL = os.getenv("WEB_APP_BASE_URL")
WEB_APP_REGISTER_URL = WEB_APP_BASE_URL + os.getenv("WEB_APP_REGISTER_URL")
WEB_APP_PASSWORD_RESET_URL = WEB_APP_BASE_URL + os.getenv("WEB_APP_PASSWORD_RESET_URL")
WEB_APP_LOGIN_URL = WEB_APP_BASE_URL + os.getenv("WEB_APP_LOGIN_URL")

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = os.getenv("EMAIL_PORT")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
if os.environ.get("EMAIL_USE_SSL", False):
    EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL")
if os.environ.get("EMAIL_USE_TLS", False):
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS")
