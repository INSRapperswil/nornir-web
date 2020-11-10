# Backend

## Setup

Create venv and install requirements. Before running the migrate command, make sure you have created a PostgreSQL database named "nornir" and the connection string in `settings.py` is correct. 

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py create_groups
python manage.py collectstatic
```

During development you can use the `python manage.py create_testdb` command to put some sample data into your database.

## Running

The backend requires a nginx server, redis server and celery worker running. nginx configuration is provided in this repository. For detailed configuration consult the SA documentation.
```
docker run --name redis -p 6379:6379 -d redis
celery -A backend worker
daphne backend.asgi:application -b 0.0.0.0
```


Server is accessible at http://127.0.0.1:8000/api

For api definition check out http://127.0.0.1:8000/swagger-ui.
You can also have a look at the openapi yaml at http://127.0.0.1:8000/openapi

## API Authentication # TODO: reimplement using JWT token
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
To register a new Job Template, to to the web_nornir/job_templates folder and place you template in it.
Then go to the admin dashboard and create a new Job Template in the database. The name you enter in the database
must be equal to the filename without the file extension (If for example the file is called `hello_world.py`, the name is `hello_world`)

### What should the Template look like?
Each template needs to contain the `job_function` function. If the function name is different, you must change it in the database accordingly.
Here is an example template:
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
