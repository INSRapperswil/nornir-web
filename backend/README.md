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
venv/bin/python manage.py create_groups
venv/bin/python manage.py runserver
docker run --name redis -p 6379:6379 -d redis
celery -A backend worker
```

Server is accessible at http://127.0.0.1:8000/api

To have a look at the api definition go to http://127.0.0.1:8000/swagger-ui to see the swagger definition.
You can also have a look at the openapi yaml at http://127.0.0.1:8000/openapi

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

## Register new Job Templates
To register a new Job Template, to to the web_nornir/job_templates folder and place you Template in it.

### What should the Template look like?
Each template needs to contain the `job_definition` dictionary and the `job_function` function.
Here is an example Template:
```python
from nornir.core.task import Task, Result

# This definition will be displayed in the frontend.
job_definition = {
    'name': 'say',
    'description': 'lets each host say a text',
    # For each parameter you define here, the user will get an input field,
    # where he can specify the needed information.
    # Make sure the names of the parameters are the same as in the function signature.
    'params': ['text'],
}


def job_function(task: Task, text: str) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says {text}"
    )

```
