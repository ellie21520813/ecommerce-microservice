#!/bin/sh

python manage.py makemigrations
python manage.py migrate --no-input
python manage.py collectstatic --no-input

gunicorn products_service.wsgi:application \
    --bind 0.0.0.0:8001 \
    --capture-output \
    --log-level debug