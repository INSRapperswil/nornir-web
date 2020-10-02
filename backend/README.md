# Backend

## Setup

Create venv and install requirements.

```
python -m venv venv
venv/bin/pip install -r requirements.txt
```

Create Database in PostgreSQL, see `manage.py` for connection details.

## Running

Run the following commands:

```
venv/bin/python manage.py migrate
venv/bin/python manage.py createsuperuser
venv/bin/python manage.py runserver
```

Server is accessible at http://127.0.0.1:8000/api

## API Authentication
*Reference: https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication*

To obtain an Authentication Token, use the following parameters:
```
POST
http://localhost:8000/api-token-auth
Accept: application/json
Content-Type: multipart/form-data
```
with Keys `username` and `password`

Call will return following json:

```json
{
    "token": "28aa707e466e9c21db8b5587f318fd70a48f6adc"
}
```

To authenticate regular requests, use the following HTTP-Header:
`Authorization: Token 28aa707e466e9c21db8b5587f318fd70a48f6adc`