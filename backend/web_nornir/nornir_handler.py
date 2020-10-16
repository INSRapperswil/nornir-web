from nornir import InitNornir
from .job_discovery import get_job_function, get_job_definitions


class NornirHandler:
    def __init__(self, config="web_nornir/nornir_config/example_config/config.yaml"):
        self.nr = InitNornir(config_file=config)

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

    def execute_task(self, job_name: str, params: dict, filter_arguments: dict):
        selection = self.nr.filter(**filter_arguments)
        params_copy = params.copy()
        params_copy['task'] = get_job_function(job_name)
        return selection.run(**params_copy)
