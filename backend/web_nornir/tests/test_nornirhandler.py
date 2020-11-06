import pytest

from web_nornir.nornir_handler import NornirHandler


class TestNornirHandler:
    def test_init_nornir_with_valid_inventory_with_defaults(self):
        host_file = 'web_nornir/nornir_config/test_config/hosts.yaml'
        group_file = 'web_nornir/nornir_config/test_config/groups.yaml'
        default_file = 'web_nornir/nornir_config/test_config/defaults.yaml'
        nh = NornirHandler(host_file, group_file, default_file)
        assert nh.nr.config.inventory.options['host_file'] == host_file
        assert nh.nr.config.inventory.options['group_file'] == group_file
        assert nh.nr.config.inventory.options['defaults_file'] == default_file

    def test_init_nornir_with_valid_inventory_without_defaults(self):
        host_file = 'web_nornir/nornir_config/test_config/hosts.yaml'
        group_file = 'web_nornir/nornir_config/test_config/groups.yaml'
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
        host_file = 'web_nornir/nornir_config/test_config/hosts.yaml'
        group_file = 'web_nornir/nornir_config/test_config/groups.yaml'
        nh = NornirHandler(host_file, group_file)
        assert nh.get_host_detail('device1.test') == {'name': 'device1.test', 'groups': ['testgroup'],
                                                      'hostname': '127.127.0.1', 'port': 2202, 'platform': 'ios',
                                                      'data': {'ospf': 1, 'asn': 65001, 'domain': 'test.testing'}}

    def test_get_configuration(self):
        expected = {
            'logging': {'enabled': True,
                        'format': '%(asctime)s - %(name)12s - %(levelname)8s - %(funcName)10s() - %(message)s',
                        'level': 'INFO',
                        'log_file': 'nornir.log'},
            'runner': {'options': {'num_workers': 200},
                       'plugin': 'threaded'},
        }

        assert NornirHandler.get_configuration() == expected

    def test_set_configuration(self):
        expected = 200

        new_configuration = {
            'logging': {'enabled': True,
                        'format': '%(asctime)s - %(name)12s - %(levelname)8s - %(funcName)10s() - %(message)s',
                        'level': 'INFO',
                        'log_file': 'nornir.log'},
            'runner': {'options': {'num_workers': expected},
                       'plugin': 'threaded'},
        }

        NornirHandler.set_configuration(new_configuration)
        assert NornirHandler.get_configuration()['runner']['options']['num_workers'] == expected
