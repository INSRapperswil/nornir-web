from nornir_napalm.plugins.tasks import napalm_ping
from nornir_utils.plugins.functions import print_result
from web_nornir.nornir_handler import NornirHandler


class TestTemplate:
    file_name = 'ping.py'
    function_name = 'job_function'

    def get_package_path(self):
        return 'web_nornir/job_templates'


def main():
    nh = NornirHandler('web_nornir/nornir_config/inslab_config/hosts.yaml',
                       'web_nornir/nornir_config/inslab_config/groups.yaml')

    # result = nh.execute_task(TestTemplate(), {'name': 'ping'}, {'hosts': ['spine1']})
    result = nh.nr.run(task=napalm_ping,dest='127.0.0.1')
    print_result(result)


if __name__ == "__main__":
    main()
