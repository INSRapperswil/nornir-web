from nornir.core.task import Task, Result
from nornir_napalm.plugins.tasks import napalm_ping


def job_function(task: Task) -> Result:
    return Result(
        host=task.host,
        result=task.run(task=napalm_ping,dest=task.host.hostname)
    )
