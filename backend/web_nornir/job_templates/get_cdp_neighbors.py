from nornir.core.task import Task, Result
from nornir_netmiko import netmiko_send_command


def job_function(task: Task) -> Result:
    return Result(
        host=task.host,
        result=task.run(netmiko_send_command, command_string='show cdp neighbors', use_textfsm=True)
    )
