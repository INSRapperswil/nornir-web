from nornir import InitNornir
from .job_discovery import get_job_function, get_job_definitions


class NornirHandler:
    def __init__(self, config="nornir_config/config.yaml"):
        self.nr = InitNornir(config_file=config)

    def get_hosts(self):
        return self.nr.inventory.hosts

    def get_groups(self):
        return self.nr.inventory.groups

    @staticmethod
    def get_job_template_definitions():
        return get_job_definitions()

    def execute_task(self, job_name: str, params: dict, filter_arguments: dict):
        selection = self.nr.filter(filter_arguments)
        params['task'] = get_job_function(job_name)
        return selection.run(params)
