import requests
from requests.exceptions import RequestException
from django.conf import settings

AUTH_BASE_URL = settings.AUTH_BASE_URL
#AUTH_BASE_URL = 'http://127.0.0.1:8000/api'


def get_user(token):
    try:
        res = requests.get(f'{AUTH_BASE_URL}/get-something/', headers={
                'Authorization': token,
                'Content-Type': 'application/json'
            })
        res.raise_for_status()
        return res.json().get('user'), None
    except RequestException as e:
        return None,  str(e)


def get_user_details(token):
    try:
        res = requests.get(f'{AUTH_BASE_URL}/get-something/', headers={
            'Authorization': token,
            'Content-Type': 'application/json'
        })
        res.raise_for_status()
        return res.json(), None
    except RequestException as e:
        return None, str(e)


def update_user(slug, token, data):
    try:
        res = requests.patch(f'{AUTH_BASE_URL}/users/{slug}/', json=data, headers={
            "Authorization": token,
            "Content-Type": 'application/json'
        })
        res.raise_for_status()
        return res.status_code, None
    except RequestException as e:
        return None, str(e)



