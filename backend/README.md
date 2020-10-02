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