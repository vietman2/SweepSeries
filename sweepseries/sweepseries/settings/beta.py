from .base import * # pylint: disable=W0401,W0614

SECRET_KEY = config("SECRET_KEY")

DEBUG = False

ALLOWED_HOSTS = ['testapi.sweepseries.com']

ADMIN_PAGE_URL = 'https://admin.sweepseries.com'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sweeptest',
        'USER': 'sweeptest',
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': '5432',
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'gunicorn_error': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/app/logs/server_error.log',
            'formatter': 'verbose',
        },
        'gunicorn_access': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/app/logs/server_access.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'gunicorn.error': {
            'handlers': ['gunicorn_error'],
            'level': 'ERROR',
            'propagate': True,
        },
        'gunicorn.access': {
            'handlers': ['gunicorn_access'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

REST_AUTH = {
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'access',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh',
    'JWT_AUTH_SECURE': True,
    'JWT_AUTH_SAMESITE': 'None',
    'JWT_AUTH_HTTPONLY': False,
    'JWT_AUTH_RETURN_EXPIRATION': True,
    'JWT_AUTH_COOKIE_USE_CSRF' : True,
    'SESSION_LOGIN': False,

    'USER_DETAILS_SERIALIZER': 'auth.user.serializers.UserAuthSerializer',
}

## Kakao Login & Naver Login
KAKAO_APP_KEY = config('KAKAO_APP_KEY')
NAVER_CONSUMER_KEY = config('NAVER_CONSUMER_KEY')
NAVER_CONSUMER_SECRET = config('NAVER_CONSUMER_SECRET')

## Storage
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_KEY')
AWS_STORAGE_BUCKET_NAME = 'sweepdev'
AWS_S3_ENDPOINT_URL = 'https://kr.object.ncloudstorage.com'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_QUERYSTRING_AUTH = False

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = 'https://kr.object.ncloudstorage.com/sweepdev/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

## SMS
SMS_API_KEY = config("SMS_API_KEY")

## Naver Map
NAVER_CLIENT_ID = config("NAVER_API_KEY_ID")
NAVER_CLIENT_SECRET = config("NAVER_API_KEY")

CORS_ALLOWED_ORIGINS = [
    "https://sweepseries.com",
    "https://www.sweepseries.com",
    "https://testapi.sweepseries.com",
    "https://admin.sweepseries.com",
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "x-csrftoken",
]
CORS_ALLOW_METHODS = [
    "GET",
    "POST",
    "OPTIONS",
    "PUT",
    "DELETE",
]
CSRF_TRUSTED_ORIGINS = [
    "https://testapi.sweepseries.com",
    "https://admin.sweepseries.com",
]
CORS_PREFLIGHT_MAX_AGE = 3600

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
X_FRAME_OPTIONS = 'DENY'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year in seconds
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
