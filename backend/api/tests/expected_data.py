expected_inventory_list = [
    {'detail': 'http://testserver/api/inventories/1/',
     'groups_file': 'groups.yml',
     'hosts_file': 'hosts.yml',
     'id': 1,
     'name': 'Base',
     'type': 1},
]

expected_jobtemplate_list = [
    {'description': 'This prints a hello world',
     'detail': 'http://testserver/api/templates/1/',
     'file_path': 'helo.py',
     'id': 1,
     'name': 'hello_world'},
    {'description': 'Updates Cisco Firmware',
     'detail': 'http://testserver/api/templates/2/',
     'file_path': 'update_cisco.py',
     'id': 2,
     'name': 'Update Firmware'},
]

expected_task_list = [
    {'created_by': 'norbert',
     'date_finished': None,
     'date_scheduled': '2020-10-09T15:52:52.650855Z',
     'date_started': None,
     'detail': 'http://testserver/api/tasks/1/',
     'id': 1,
     'input': {},
     'name': 'Get Hello World',
     'result': {},
     'status': 1,
     'template': 1,
     'variables': {}},
    {'created_by': 'thomastest',
     'date_finished': None,
     'date_scheduled': '2020-10-09T15:52:52.657905Z',
     'date_started': None,
     'detail': 'http://testserver/api/tasks/2/',
     'id': 2,
     'input': {},
     'name': 'Update Firmware',
     'result': {},
     'status': 1,
     'template': 2,
     'variables': {}},
]
