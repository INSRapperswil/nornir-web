import pytest

from web_nornir.nornir_handler import NornirHandler

host_file = 'web_nornir/nornir_config/test_config/hosts.yaml'
group_file = 'web_nornir/nornir_config/test_config/groups.yaml'
default_file = 'web_nornir/nornir_config/test_config/defaults.yaml'


class MockTemplate:
    function_name = 'job_function'

    def get_package_path(self):
        return 'web_nornir/job_templates'

    def __init__(self, file_name='hello_world.py'):
        self.file_name = file_name


class TestNornirHandler:
    def test_init_nornir_with_valid_inventory_with_defaults(self):
        nh = NornirHandler(host_file, group_file, default_file)
        assert nh.nr.config.inventory.options['host_file'] == host_file
        assert nh.nr.config.inventory.options['group_file'] == group_file
        assert nh.nr.config.inventory.options['defaults_file'] == default_file

    def test_init_nornir_with_valid_inventory_without_defaults(self):
        nh = NornirHandler(host_file, group_file)
        assert nh.nr.config.inventory.options['host_file'] == host_file
        assert nh.nr.config.inventory.options['group_file'] == group_file
        assert nh.nr.config.inventory.options['defaults_file'] == 'web_nornir/nornir_config/defaults.yaml'

    def test_init_nornir_with_non_existing_inventory(self):
        non_existing_host = 'nohost.yaml'
        non_existing_group = 'nogroup.yaml'
        nh = NornirHandler(non_existing_host, non_existing_group)
        assert nh.nr.config.inventory.options['host_file'] == 'web_nornir/nornir_config/example_config/hosts.yaml'
        assert nh.nr.config.inventory.options['group_file'] == 'web_nornir/nornir_config/example_config/groups.yaml'
        assert nh.nr.config.inventory.options['defaults_file'] == 'web_nornir/nornir_config/defaults.yaml'

    def test_get_host_detail(self):
        nh = NornirHandler(host_file, group_file)
        assert nh.get_host_detail('device1.test') == {'name': 'device1.test', 'groups': ['testgroup', 'othergroup'],
                                                      'hostname': '127.127.0.1', 'port': 2202, 'platform': 'ios',
                                                      'data': {'ospf': 1, 'asn': 65001, 'domain': 'test.testing'}}

    def test_get_host_filter(self):
        nh = NornirHandler(host_file, group_file, default_file)

        assert nh.get_hosts([{'groups__any': ['testgroup', 'othergroup']}]) == [
            {'data': {'domain': 'test.testing'}, 'groups': ['testgroup'], 'hostname': '127.0.0.1', 'name': 'host1.test',
             'platform': 'linux', 'port': 22},
            {'data': {'domain': 'test.testing'}, 'groups': ['testgroup'], 'hostname': '127.0.2.1', 'name': 'host2.test',
             'platform': 'linux', 'port': 22},
            {'data': {'asn': 65001, 'domain': 'test.testing', 'ospf': 1}, 'groups': ['testgroup', 'othergroup'],
             'hostname': '127.127.0.1', 'name': 'device1.test', 'platform': 'ios', 'port': 2202},
            {'data': {'domain': 'other.test'}, 'groups': ['othergroup'], 'hostname': '0.0.0.0',
             'name': 'unreachable.host', 'platform': 'ios', 'port': 2202}, ]

        assert nh.get_hosts([{'groups__any': ['othergroup']}]) == [
            {'name': 'device1.test', 'groups': ['testgroup', 'othergroup'], 'hostname': '127.127.0.1', 'port': 2202,
             'platform': 'ios', 'data': {'ospf': 1, 'asn': 65001, 'domain': 'test.testing'}},
            {'data': {'domain': 'other.test'}, 'groups': ['othergroup'], 'hostname': '0.0.0.0',
             'name': 'unreachable.host', 'platform': 'ios', 'port': 2202}, ]

    def test_get_host_invalid_filter(self):
        nh = NornirHandler(host_file, group_file, default_file)

        assert nh.get_hosts([{'groups__any': ['nonexisting']}]) == []

    def test_get_host_without_filter(self):
        nh = NornirHandler(host_file, group_file, default_file)

        assert nh.get_hosts() == [
            {'data': {'domain': 'test.testing'}, 'groups': ['testgroup'], 'hostname': '127.0.0.1', 'name': 'host1.test',
             'platform': 'linux', 'port': 22},
            {'data': {'domain': 'test.testing'}, 'groups': ['testgroup'], 'hostname': '127.0.2.1', 'name': 'host2.test',
             'platform': 'linux', 'port': 22},
            {'data': {'asn': 65001, 'domain': 'test.testing', 'ospf': 1}, 'groups': ['testgroup', 'othergroup'],
             'hostname': '127.127.0.1', 'name': 'device1.test', 'platform': 'ios', 'port': 2202},
            {'data': {'domain': 'other.test'}, 'groups': ['othergroup'], 'hostname': '0.0.0.0',
             'name': 'unreachable.host', 'platform': 'ios', 'port': 2202}, ]

    def test_execute_task(self):
        nh = NornirHandler(host_file, group_file, default_file)
        result = nh.execute_task(MockTemplate(), {'name': 'Hello World'}, {'hosts': ['host1.test']})
        assert result == {'failed': False,
                          'hosts': [{'failed': False, 'hostname': '127.0.0.1', 'name': 'host1.test',
                                     'result': ['host1.test says hello world!']}]}

    def test_execute_task_fails(self):
        nh = NornirHandler(host_file, group_file, default_file)
        result = nh.execute_task(MockTemplate(file_name='ping.py'), {'name': 'Ping', 'target': '255.255.255.255'},
                                 {'hosts': ['unreachable.host']})
        assert result == {'failed': True,
                          'hosts': [{'failed': True, 'hostname': '0.0.0.0', 'name': 'unreachable.host',
                                     'result': ['Subtask: napalm_ping (failed)\n', 'Cannot connect to 0.0.0.0']}]}

    def test_get_configuration(self):
        expected = {
            'logging': {'enabled': True,
                        'format': '%(asctime)s - %(name)12s - %(levelname)8s - %(funcName)10s() - %(message)s',
                        'level': 'INFO', 'log_file': 'nornir.log'},
            'runner': {'options': {'num_workers': 200}, 'plugin': 'threaded'},
        }

        assert NornirHandler.get_configuration() == expected

    def test_set_configuration(self):
        expected = 200

        new_configuration = {
            'logging': {'enabled': True,
                        'format': '%(asctime)s - %(name)12s - %(levelname)8s - %(funcName)10s() - %(message)s',
                        'level': 'INFO', 'log_file': 'nornir.log'},
            'runner': {'options': {'num_workers': expected}, 'plugin': 'threaded'},
        }

        NornirHandler.set_configuration(new_configuration)
        assert NornirHandler.get_configuration()['runner']['options']['num_workers'] == expected

    def test_filter_hosts(self):
        nh = NornirHandler(host_file, group_file)
        filtered = nh.filter_hosts(nh.nr.filter(), [{'groups__contains': 'othergroup'}])
        host_keys = filtered.inventory.hosts.keys()
        assert 'device1.test' in host_keys
        assert 'host1.test' not in host_keys

    def test_filter_hosts_no_filters(self):
        nh = NornirHandler(host_file, group_file)
        initial = nh.nr.filter()
        filtered = nh.filter_hosts(initial, [])
        assert filtered.inventory.hosts == initial.inventory.hosts

    def test_search_hosts(self):
        nh = NornirHandler(host_file, group_file)
        initial = nh.nr.filter()
        searched = nh.search_hosts(initial, ['name__contains', 'hostname__contains'], '127.127.')
        assert len(searched.inventory.hosts) == 1
        assert 'device1.test' in searched.inventory.hosts.keys()

    def test_search_hosts_empty_search(self):
        nh = NornirHandler(host_file, group_file)
        initial = nh.nr.filter()
        searched = nh.search_hosts(initial, ['name__contains', 'hostname__contains'], '')
        assert searched.inventory.hosts == initial.inventory.hosts
        searched = nh.search_hosts(initial, [], '127.127.')
        assert searched.inventory.hosts == initial.inventory.hosts
