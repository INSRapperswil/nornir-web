from nornir.core.task import Task, Result
from nornir_napalm.plugins.tasks import napalm_get


def job_function(task: Task) -> Result:
    return Result(
        host=task.host,
        result=task.run(task=napalm_get, getters=['config'])
    )
