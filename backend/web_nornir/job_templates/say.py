from nornir.core.task import Task, Result


def job_function(task: Task, text: str) -> Result:
    return Result(
        host=task.host,
        result=f'{task.host.name} says {text}'
    )
