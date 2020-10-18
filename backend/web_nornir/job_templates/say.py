from nornir.core.task import Task, Result

job_definition = {
    'name': 'say',
    'description': 'lets each host say a text',
    'params': ['text'],
}


def job_function(task: Task, text: str) -> Result:
    return Result(
        host=task.host,
        result=f"{task.host.name} says {text}"
    )
