from nornir import InitNornir


def main():
    nr = InitNornir(config_file='web_nornir/nornir_config/example_config/config.yaml')
    hosts: list = []
    for host in nr.inventory.hosts:
        host_data = nr.inventory.hosts[host].dict()
        host_data.pop('connection_options', None)
        host_data.pop('username', None)
        host_data.pop('password', None)
        hosts.append(host_data)

    print(hosts)


if __name__ == "__main__":
    main()
