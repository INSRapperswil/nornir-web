from nornir.core.task import Task, Result


def job_function(task: Task) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says hello world!"
    )


job_definition = {
    'name': 'hello_world',
    'description': 'returns hello from each hostname',
    'params': [],
}
