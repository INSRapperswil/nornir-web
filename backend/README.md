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
In development you can use the `venv/bin/python manage.py create_testdb` command to put some sample data into your database.

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
Then Go to the admin dashboard and create a new Job Template in the database. The name you give it in the database
must be equal to the filename without the file extension (If for example the file is called `hello_world.py`, the name is `hello_world`)

### What should the Template look like?
Each template needs to contain the `job_function` function.
Here is an example Template:
```python
from nornir.core.task import Task, Result

# The function must be called job_function, so that the application will automatically find it.
# Consult the nornir documentation on how to write a nornir Task.
def job_function(task: Task, text: str) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says {text}"
    )

```
