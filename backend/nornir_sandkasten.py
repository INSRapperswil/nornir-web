import json
from typing import Dict

from nornir import InitNornir
from nornir.core.inventory import Host
from nornir.core.task import AggregatedResult, MultiResult, Task
from nornir_netmiko import netmiko_send_command
from web_nornir.nornir_handler import NornirHandler


# With Processor
class SaveResultToDict:
    def __init__(self, data: Dict[str, None]) -> None:
        self.data = data

    def task_started(self, task: Task) -> None:
        self.data[task.name] = {}
        self.data[task.name]["started"] = True

    def task_completed(self, task: Task, result: AggregatedResult) -> None:
        self.data[task.name]["completed"] = True

    def task_instance_started(self, task: Task, host: Host) -> None:
        self.data[task.name][host.name] = {"started": True}

    def task_instance_completed(
            self, task: Task, host: Host, result: MultiResult
    ) -> None:
        self.data[task.name][host.name] = {
            "completed": True,
            "result": result.result,
        }

    def subtask_instance_started(self, task: Task, host: Host) -> None:
        pass  # to keep example short and sweet we ignore subtasks

    def subtask_instance_completed(
            self, task: Task, host: Host, result: MultiResult
    ) -> None:
        pass  # to keep example short and sweet we ignore subtasks


def get_interfaces_with_processors():
    nr = InitNornir(config_file='web_nornir/nornir_config/configuration.yaml',
                                 inventory={'plugin': 'SimpleInventory',
                                            'options': {
                                                'host_file': 'web_nornir/nornir_config/inslab_config/hosts.yaml',
                                                'group_file': 'web_nornir/nornir_config/inslab_config/groups.yaml'
                                            }}, )
    result: dict = {}

    nr_with_processors = nr.with_processors([SaveResultToDict(result)])

    nr_with_processors.run(netmiko_send_command, command_string='sh ip int brief')
    print(result)
    print(json.dumps(result))


def get_interfaces():
    nr = InitNornir(config_file='web_nornir/nornir_config/inslab_config/config.yaml')
    aggregated_task_result = nr.run(netmiko_send_command, command_string='sh ip int brief')
    # print_result(result)

    result_list = []
    for host_results in aggregated_task_result:
        host_dict = {
            'hostname': aggregated_task_result[host_results].host.hostname,
            'failed': aggregated_task_result[host_results].failed,
            'result': []
        }
        for single_result in aggregated_task_result[host_results]:
            host_dict['result'].append(single_result.result)
        result_list.append(host_dict)
    print(result_list)


# TODO Config-Options
# - Runner
# - Num Workers
# - Inventory Host/Group-File
# - logging level
# - logging file
# - logging format

def load_inventory(group_file, host_file):
    if group_file is not None and host_file is not None:
        return {'plugin': 'SimpleInventory',
                'options': {
                    'host_file': host_file,
                    'group_file': group_file
                }}

class TestTemplate:
    file_name = 'get_interfaces.py'
    function_name = 'job_function'
    
    def get_package_path(self):
        return 'web_nornir/job_templates'

def main():
    # get_interfaces()
    # get_interfaces_with_processors()
    nr = NornirHandler('web_nornir/nornir_config/inslab_config/hosts.yaml', 'web_nornir/nornir_config/inslab_config/groups.yaml')
    # print(nr.get_hosts())
    result = nr.execute_task(TestTemplate(), { 'name': 'test run get interfaces'}, { 'hosts': ['spine1'] })
    print(result)

    # group_file = 'web_nornir/nornir_config/other_config/groups.yaml'
    # group_file = None
    # host_file = 'web_nornir/nornir_config/other_config/hosts.yaml'

    # If group file or host file are missing, defaulting to the inventory in configuration
    # nr = InitNornir(
    #     config_file='web_nornir/nornir_config/configuration.yaml',
    #     inventory=load_inventory(group_file=group_file, host_file=host_file),

    # )
    # print(nr.config.runner.options['num_workers'])
    # print(nr.config.inventory.options['host_file'])
    # print(nr.config.inventory.options['group_file'])


if __name__ == "__main__":
    main()
