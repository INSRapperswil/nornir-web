import yaml
from nornir import InitNornir
from nornir.core.inventory import Host
from nornir.core.task import AggregatedResult
from nornir.core.filter import F
from pathlib import Path

from .job_discovery import JobDiscovery

# Global defaults for all nornir inventories
DEFAULT_FILE = 'web_nornir/nornir_config/defaults.yaml'


class NornirHandler:
    def __init__(self, host_file, group_file, default_file=DEFAULT_FILE):
        # Load default configs if invalid file path given
        if not Path(host_file).is_file():
            host_file = 'web_nornir/nornir_config/example_config/hosts.yaml'
        if not Path(group_file).is_file():
            group_file = 'web_nornir/nornir_config/example_config/groups.yaml'
        if default_file is None or not Path(default_file).is_file():
            default_file = DEFAULT_FILE

        self.nr = InitNornir(config_file='web_nornir/nornir_config/configuration.yaml',
                             inventory={'plugin': 'SimpleInventory',
                                        'options': {
                                            'host_file': host_file,
                                            'group_file': group_file,
                                            'defaults_file': default_file
                                        }}, )

    def get_hosts(self) -> list:
        hosts = []
        for name in self.nr.inventory.hosts:
            hosts.append(self.get_host_detail(name))
        return hosts

    def get_host_detail(self, name: str) -> dict:
        try:
            host = self.nr.inventory.hosts[name]
            return self.format_host(host)
        except KeyError:
            raise LookupError

    def get_groups(self) -> dict:
        return self.nr.inventory.groups

    def execute_task(self, job_template, params: dict, filter_arguments: dict) -> dict:
        filter_arguments_copy = filter_arguments.copy()
        params_copy = params.copy()
        hosts = filter_arguments_copy.pop('hosts', None)
        selection = self.nr.filter(F(name__any=hosts)) if hosts else self.nr
        selection = selection.filter(**filter_arguments_copy)
        jd = JobDiscovery(job_template.get_package_path())
        params_copy['task'] = jd.get_job_function(job_template.file_name, job_template.function_name)
        result = selection.run(**params_copy)
        return self.format_result(result)

    @staticmethod
    def get_job_template_definitions(package_path=None):
        return JobDiscovery(package_path).get_job_definitions()

    @staticmethod
    def format_host(nornir_host: Host) -> dict:
        # remove unwanted or critical properties
        host = nornir_host.dict()
        host.pop('connection_options', None)
        host.pop('username', None)
        host.pop('password', None)
        host.pop('data', None)

        # add hierarchical data attributes.
        # basically copied from protected method _resolve_data in Host(InventoryElement)
        processed = []
        data = {}
        for k, v in nornir_host.data.items():
            processed.append(k)
            data[k] = v
        for g in nornir_host.groups:
            for k, v in g.items():
                if k not in processed:
                    processed.append(k)
                    data[k] = v

        host.update({'data': data})
        return host

    @staticmethod
    def format_result(aggregated_result: AggregatedResult) -> dict:
        result = {
            'failed': aggregated_result.failed,
            'hosts': []
        }

        for host_results in aggregated_result:
            host_dict = {
                'hostname': aggregated_result[host_results].host.hostname,
                'name': aggregated_result[host_results].host.name,
                'failed': aggregated_result[host_results].failed,
                'result': aggregated_result[host_results].result[0].result
            }
            result['hosts'].append(host_dict)

        return result

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
