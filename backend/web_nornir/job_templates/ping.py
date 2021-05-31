from nornir.core.task import Task, Result
from nornir_napalm.plugins.tasks import napalm_ping


def job_function(task: Task, target: str) -> Result:
    return Result(
        host=task.host,
        result=task.run(task=napalm_ping, dest=target)
    )
