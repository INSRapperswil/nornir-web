expected_inventory_list = [
    {
        "id": 1,
        "detail": "http://testserver/api/inventories/1/",
        "name": "Example",
        "type": 1,
        "hosts_file": "web_nornir/nornir_config/example_config/hosts.yaml",
        "groups_file": "web_nornir/nornir_config/example_config/groups.yaml"
    },
    {
        "id": 2,
        "detail": "http://testserver/api/inventories/2/",
        "name": "INS Lab",
        "type": 1,
        "hosts_file": "web_nornir/nornir_config/inslab_config/hosts.yaml",
        "groups_file": "web_nornir/nornir_config/inslab_config/groups.yaml"
    }
]

expected_jobtemplate_list = [
    {
        "id": 1,
        "detail": "http://testserver/api/templates/1/",
        "name": "hello_world",
        "description": "This prints a hello world",
        "file_name": "hello_world.py",
        "package_path": "/web_nornir/job_templates/",
        "function_name": "job_function",
        "created_by": "thomastest",
        "variables": [],
    },
    {
        "id": 2,
        "detail": "http://testserver/api/templates/2/",
        "name": "Get CDP Neighbors",
        "description": "Lists all CDP neighbors",
        "file_name": "get_cdp_neighbor.py",
        "package_path": "/web_nornir/job_templates/",
        "function_name": "job_function",
        "created_by": "thomastest",
        "variables": [],
    },
    {
        "id": 3,
        "detail": "http://testserver/api/templates/3/",
        "name": "Get Interfaces",
        "description": "Gets brief information about all interfaces, sh ip int br",
        "file_name": "get_interfaces.py",
        "package_path": "/web_nornir/job_templates/",
        "function_name": "job_function",
        "created_by": "thomastest",
        "variables": [],
    }
]

expected_task_list = [
    {
        "id": 1,
        "detail": "http://testserver/api/tasks/1/",
        "name": "Get Hello World",
        "status": 0,
        "date_scheduled": None,
        "date_started": None,
        "date_finished": None,
        "variables": {},
        "result_host_selection": None,
        "filters": {},
        "result": {},
        "created_by": "thomastest",
        "template": 1,
        "inventory": 1
    },
    {
        "id": 2,
        "detail": "http://testserver/api/tasks/2/",
        "name": "Get CDP neighbors of INS lab",
        "status": 0,
        "date_scheduled": None,
        "date_started": None,
        "date_finished": None,
        "variables": {},
        "result_host_selection": None,
        "filters": {},
        "result": {},
        "created_by": "norbert",
        "template": 2,
        "inventory": 2
    },
    {
        "id": 3,
        "detail": "http://testserver/api/tasks/3/",
        "name": "Get interfaces of INS lab",
        "status": 0,
        "date_scheduled": None,
        "date_started": None,
        "date_finished": None,
        "variables": {},
        "result_host_selection": None,
        "filters": {},
        "result": {},
        "created_by": "norbert",
        "template": 3,
        "inventory": 2
    }
]
