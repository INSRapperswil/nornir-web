from nornir.core.task import Result, Task


def job_function(task: Task) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says hello test!"
    )


job_definition = {
    'name': 'hello_test',
    'description': 'returns hello from each hostname',
    'params': [],
}
