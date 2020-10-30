import yaml
from nornir import InitNornir
from nornir.core.task import AggregatedResult
from nornir.core.filter import F
from pathlib import Path

from .job_discovery import JobDiscovery


class NornirHandler:
    def __init__(self, host_file, group_file):
        if Path(host_file).is_file() and Path(group_file).is_file():
            self.nr = InitNornir(config_file='web_nornir/nornir_config/configuration.yaml',
                                 inventory={'plugin': 'SimpleInventory',
                                            'options': {
                                                'host_file': host_file,
                                                'group_file': group_file
                                            }}, )
        else:
            # Default to example_config
            self.nr = InitNornir(config_file='web_nornir/nornir_config/configuration.yaml',
                                 inventory={'plugin': 'SimpleInventory',
                                            'options': {
                                                'host_file': 'web_nornir/nornir_config/example_config/hosts.yaml',
                                                'group_file': 'web_nornir/nornir_config/example_config/groups.yaml'
                                            }}, )

    def get_hosts(self):
        hosts = []
        for host in self.nr.inventory.hosts:
            host_data = self.nr.inventory.hosts[host].dict()
            host_data.pop('connection_options', None)
            host_data.pop('username', None)
            host_data.pop('password', None)
            hosts.append(host_data)

        return hosts

    def get_groups(self):
        return self.nr.inventory.groups

    @staticmethod
    def get_job_template_definitions(package_path=None):
        return JobDiscovery(package_path).get_job_definitions()

    @staticmethod
    def format_result(aggregated_result: AggregatedResult) -> dict:
        result = {
            'failed': aggregated_result.failed,
            'hosts': []
        }

        for host_results in aggregated_result:
            host_dict = {
                'hostname': aggregated_result[host_results].host.hostname,
                'failed': aggregated_result[host_results].failed,
                'result': f'{aggregated_result[host_results].result[0]}'
            }
            result['hosts'].append(host_dict)

        return result

    def execute_task(self, job_template, params: dict, filter_arguments: dict) -> dict:
        jd = JobDiscovery(job_template.get_package_path())
        hosts = filter_arguments.pop('hosts', None)
        selection = self.nr.filter(F(hosts__any=hosts)) if hosts else self.nr
        selection = selection.filter(**filter_arguments)
        params_copy = params.copy()
        params_copy['task'] = jd.get_job_function(job_template.file_name, job_template.function_name)
        result = selection.run(**params_copy)
        return self.format_result(result)

    @staticmethod
    def get_configuration() -> dict:
        conf_yml = open('web_nornir/nornir_config/configuration.yaml', 'r')
        conf_dict = yaml.load(conf_yml, Loader=yaml.FullLoader)
        return conf_dict

    @staticmethod
    def set_configuration(new_configuration) -> dict:
        conf_yml = open('web_nornir/nornir_config/configuration.yaml', 'w')
        conf_yml.write(yaml.dump(new_configuration))
        return new_configuration
