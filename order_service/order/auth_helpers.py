import requests
from requests.exceptions import RequestException

AUTH_BASE_URL = 'http://127.0.0.1:8000/api'
PRODUCT_BASE_URL = 'http://127.0.0.1:8001/api'


def get_user(token):
    try:
        res = requests.get(f'{AUTH_BASE_URL}/get-something/', headers={
            'Authorization': token,
            'Content-Type': 'application/json'
        })
        res.raise_for_status()
        return res.json().get('user'), None

    except RequestException as e:
        return None, str(e)


def get_user_detail(token):
    try:
        res = requests.get(f'{AUTH_BASE_URL}/get-something/', headers={
            'Authorization': token,
            'Content-Type': 'application/json'
        })
        res.raise_for_status()
        return res.json(), None
    except RequestException as e:
        return None, str(e)


def get_product(product_id):
    try:
        res = requests.get(f'{PRODUCT_BASE_URL}/v1/product/{product_id}/')
        res.raise_for_status()
        return res.json(), None
    except RequestException as e:
        return None, str(e)


def update_product(product_id, data, token):
    try:
        res = requests.patch(f'{PRODUCT_BASE_URL}/v1/product/{product_id}/', json=data, headers={
            'Authorization': token,
            'Content-Type': 'application/json'
        })
        res.raise_for_status()
        return res.status_code, None
    except RequestException as e:
        return None, str(e)
