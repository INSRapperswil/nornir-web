from pathlib import Path

import yaml
from nornir import InitNornir
from nornir.core.filter import F
from nornir.core.inventory import Host

from .job_discovery import JobDiscovery
from .result_serializer import serialize_result

# default Nornir inventory and default settings
HOST_FILE = 'web_nornir/nornir_config/example_config/hosts.yaml'
GROUP_FILE = 'web_nornir/nornir_config/example_config/groups.yaml'
DEFAULT_FILE = 'web_nornir/nornir_config/defaults.yaml'


class NornirHandler:
    def __init__(self, host_file, group_file, default_file=DEFAULT_FILE):
        # Load default configs if invalid file path given
        if not Path(host_file).is_file():
            host_file = HOST_FILE
        if not Path(group_file).is_file():
            group_file = GROUP_FILE
        if default_file is None or not Path(default_file).is_file():
            default_file = DEFAULT_FILE

        self.nr = InitNornir(config_file='web_nornir/nornir_config/configuration.yaml',
                             inventory={'plugin': 'SimpleInventory',
                                        'options': {
                                            'host_file': host_file,
                                            'group_file': group_file,
                                            'defaults_file': default_file
                                        }}, )

    def get_hosts(self, filter_arguments=None, search_fields=None, search_argument='') -> list:
        if filter_arguments is None:
            filter_arguments = []
        filtered = self.nr.filter()
        filtered = self.filter_hosts(filtered, filter_arguments)
        if search_argument and search_fields:
            filtered = self.search_hosts(filtered, search_fields, search_argument)
        return list(map(lambda host: self.get_host_detail(host), filtered.inventory.hosts))

    @staticmethod
    def filter_hosts(nornir, filter_arguments: list):
        for f in filter_arguments:
            nornir = nornir.filter(F(**f))
        return nornir

    @staticmethod
    def search_hosts(nornir, search_fields, search_argument):
        if len(search_fields) == 0:
            return nornir
        query = F(**{search_fields.pop(): search_argument})
        for field in search_fields:
            query = query | F(**{field: search_argument})
        return nornir.filter(query)

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
        return serialize_result(result)

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
        for k, v in nornir_host.defaults.data.items():
            if k not in processed:
                processed.append(k)
                data[k] = v

        host.update({'data': data})
        return host

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
