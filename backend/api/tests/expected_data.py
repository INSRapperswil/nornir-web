expected_inventory_list = {
    'count': 2,
    'results': [{'detail': 'http://testserver/api/inventories/1/',
                 'groups_file': 'web_nornir/nornir_config/example_config/groups.yaml',
                 'hosts_file': 'web_nornir/nornir_config/example_config/hosts.yaml',
                 'id': 1,
                 'name': 'Example',
                 'type': 1},
                {'detail': 'http://testserver/api/inventories/2/',
                 'groups_file': 'web_nornir/nornir_config/inslab_config/groups.yaml',
                 'hosts_file': 'web_nornir/nornir_config/inslab_config/hosts.yaml',
                 'id': 2,
                 'name': 'INS Lab',
                 'type': 1}],
}

expected_jobtemplate_list = {
    'count': 5,
    'next': None,
    'previous': None,
    'results': [{'created_by': 1,
                 'created_name': 'thomastest',
                 'description': 'This prints a hello world',
                 'detail': 'http://testserver/api/templates/1/',
                 'file_name': 'hello_world.py',
                 'function_name': 'job_function',
                 'id': 1,
                 'name': 'hello_world',
                 'package_path': '/web_nornir/job_templates/',
                 'variables': []},
                {'created_by': 1,
                 'created_name': 'thomastest',
                 'description': 'Lists all CDP neighbors',
                 'detail': 'http://testserver/api/templates/2/',
                 'file_name': 'get_cdp_neighbors.py',
                 'function_name': 'job_function',
                 'id': 2,
                 'name': 'Get CDP Neighbors',
                 'package_path': '/web_nornir/job_templates/',
                 'variables': []},
                {'created_by': 1,
                 'created_name': 'thomastest',
                 'description': 'Gets brief information about all interfaces, sh '
                                'ip int br',
                 'detail': 'http://testserver/api/templates/3/',
                 'file_name': 'get_interfaces.py',
                 'function_name': 'job_function',
                 'id': 3,
                 'name': 'Get Interfaces',
                 'package_path': '/web_nornir/job_templates/',
                 'variables': []},
                {'created_by': 1,
                 'created_name': 'thomastest',
                 'description': 'Pings a chosen network device and reports if '
                                'reachable',
                 'detail': 'http://testserver/api/templates/4/',
                 'file_name': 'ping.py',
                 'function_name': 'job_function',
                 'id': 4,
                 'name': 'Ping Device',
                 'package_path': '/web_nornir/job_templates/',
                 'variables': ['target']},
                {'created_by': 1,
                 'created_name': 'thomastest',
                 'description': 'Gets all configuration from device',
                 'detail': 'http://testserver/api/templates/5/',
                 'file_name': 'get_configuration.py',
                 'function_name': 'job_function',
                 'id': 5,
                 'name': 'Get Configuration',
                 'package_path': '/web_nornir/job_templates/',
                 'variables': []},
                ]
}

expected_task_list = {
    'count': 3,
    'next': None,
    'previous': None,
    'results': [{'created_by': 2,
                 'created_name': 'norbert',
                 'date_finished': None,
                 'date_scheduled': None,
                 'date_started': None,
                 'detail': 'http://testserver/api/tasks/3/',
                 'filters': {},
                 'id': 3,
                 'inventory': 2,
                 'inventory_name': 'INS Lab',
                 'name': 'Get interfaces of INS lab',
                 'result': {},
                 'status': 0,
                 'template': 3,
                 'template_name': 'Get Interfaces',
                 'is_template': False,
                 'variables': {}},
                {'created_by': 2,
                 'created_name': 'norbert',
                 'date_finished': None,
                 'date_scheduled': None,
                 'date_started': None,
                 'detail': 'http://testserver/api/tasks/2/',
                 'filters': {},
                 'id': 2,
                 'inventory': 2,
                 'inventory_name': 'INS Lab',
                 'name': 'Get CDP neighbors of INS lab',
                 'result': {},
                 'status': 0,
                 'template': 2,
                 'template_name': 'Get CDP Neighbors',
                 'is_template': False,
                 'variables': {}},
                {'created_by': 1,
                 'created_name': 'thomastest',
                 'date_finished': None,
                 'date_scheduled': None,
                 'date_started': None,
                 'detail': 'http://testserver/api/tasks/1/',
                 'filters': {},
                 'id': 1,
                 'inventory': 1,
                 'inventory_name': 'Example',
                 'name': 'Get Hello World',
                 'result': {},
                 'status': 0,
                 'template': 1,
                 'template_name': 'hello_world',
                 'is_template': False,
                 'variables': {}}
                ],
}
