from nornir import InitNornir

# nr = InitNornir(config_file='web_nornir/nornir_config/example_config/config.yaml')
#
# for host in nr.inventory.hosts:
#     print(host)
#     print(nr.inventory.hosts[host].keys())
#     print('---------------')
#     for key in nr.inventory.hosts[host].keys():
#         print(f'Key: {key}; Value: {nr.inventory.hosts[host][key]}')
#     print(nr.inventory.hosts[host].__getattribute__('port'))
#     print('\n\n--HOST--\n\n')
#     print(nr.inventory.hosts.get(host).get('hostname'))
#     print('\n\n--/HOST--\n\n')
from web_nornir.nornir_handler import NornirHandler

nr = NornirHandler()

result = nr.execute_task('hello_world', { 'name': 'test task' }, { 'hostname': 'example.cmh' })

from web_nornir.job_discovery import get_job_definitions, get_job_function

print(get_job_definitions())
print(get_job_function('hello_world'))
