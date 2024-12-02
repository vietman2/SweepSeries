#! /bin/sh
set -e

echo "Running in environment: $DJANGO_SETTINGS_MODULE"

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

exec "$@"
