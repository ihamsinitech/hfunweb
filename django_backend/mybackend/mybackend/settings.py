"""
Django settings for mybackend project.
"""

from pathlib import Path
import os
from datetime import timedelta

# ---------------- BASE DIR ----------------
BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------- SECURITY ----------------
SECRET_KEY = "django-insecure-h1l0s3u4&5yd(fd(za)n5r$2gt*+lyd^b-kn$=vjhxobkhyyr7"
DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]


# ---------------- INSTALLED APPS ----------------
INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # ✅ REQUIRED FOR JWT
    "rest_framework",

    "core",
    # ✅ ADD THIS (DO NOT REMOVE ANYTHING ABOVE)
    "channels",
]

# ✅ ADD THIS (VERY IMPORTANT)
ASGI_APPLICATION = "mybackend.asgi.application"

# ✅ ADD THIS (FOR DEV – no Redis needed)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}


# ---------------- MIDDLEWARE ----------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ---------------- URL CONFIG ----------------
ROOT_URLCONF = "mybackend.urls"


# ---------------- TEMPLATES ----------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ---------------- WSGI ----------------
WSGI_APPLICATION = "mybackend.wsgi.application"


# ---------------- DATABASE ----------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ---------------- PASSWORD VALIDATION ----------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ---------------- INTERNATIONALIZATION ----------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# ---------------- STATIC FILES ----------------
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")


# ---------------- MEDIA FILES ----------------
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")


# ---------------- CORS SETTINGS ----------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "x-requested-with",
]

CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
]


# ---------------- CSRF ----------------
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]


# ---------------- REST FRAMEWORK (JWT) ----------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# ---------------- JWT SETTINGS ----------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}


# ---------------- DEFAULT FIELD ----------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
