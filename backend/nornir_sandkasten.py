from nornir import InitNornir

nr = InitNornir(config_file='web_nornir/nornir_config/example_config/config.yaml')

for host in nr.inventory.hosts:
    print(host)
    print(nr.inventory.hosts[host].keys())
    print('---------------')
    for key in nr.inventory.hosts[host].keys():
        print(f'Key: {key}; Value: {nr.inventory.hosts[host][key]}')
    print(nr.inventory.hosts[host].__getattribute__('port'))
    print('\n\n--HOST--\n\n')
    print(nr.inventory.hosts.get(host).get('hostname'))
    print('\n\n--/HOST--\n\n')
