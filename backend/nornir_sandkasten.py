import json

from web_nornir.nornir_handler import NornirHandler


class TestTemplate:
    file_name = 'ping.py'
    function_name = 'job_function'

    def get_package_path(self):
        return 'web_nornir/job_templates'


def main():
    nh = NornirHandler('web_nornir/nornir_config/inslab_config/hosts.yaml',
                       'web_nornir/nornir_config/inslab_config/groups.yaml')

    result = nh.execute_task(TestTemplate(), {'name': 'ping unreachable', 'target': 'vrf mgmt 10.20.0.202'},
                             {'hosts': ['spine1']})
    print(json.dumps(result))


if __name__ == "__main__":
    main()
