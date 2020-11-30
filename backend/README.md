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

In develoopment, you can also use the command  `python manage.py runserver` instead of running it with daphne.

Server is accessible at http://127.0.0.1:8000/api

For api definition check out http://127.0.0.1:8000/swagger-ui.
You can also have a look at the openapi yaml at http://127.0.0.1:8000/openapi

## API Authentication
*Reference: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/*

To obtain an Authentication Token, use the following parameters:
```
POST
http://localhost:8000/token/
Accept: application/json
Content-Type: multipart/form-data
```
with Keys `username` and `password` in the body.

Call will return following json:

```json
{
    "access": "<access token>",
    "refresh": "<refresh token>"
}
```

To authenticate regular requests, use the following HTTP-Header:
`Authorization: Bearer <access token>`

To refresh the access token, use the following Call:
```
POST
http://localhost:8000/token/refresh/
Accept: application/json
Content-Type: multipart/form-data
```
With the refresh token in the body.

Call will return following json:
```json
{
    "access": "<access token>"
}
```


## Register new Job Templates

It is easiest to create a new Job Template, by using the admin interface.
When creating a new Template, there is a default module path, file name and function name given.
these Variables determine, where the application will be able to find your template.  
Then you can place the new template in the location you specified in the admin interface.

### What should the Template look like?
Here is an example template: file: `say.py`
```python
from nornir.core.task import Task, Result

def job_function(task: Task, text: str) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says {text}"
    )

```
If you want to use parameters, like `text` in the example, whose value should be provided by the user,
list them in the form in the admin interface as an array of strings.

Check the [nornir documentation](https://nornir.readthedocs.io/en/latest/) if you need information on how to create a Task function.

Keep in mind, that the application does not support nested multiresults at the moment.
