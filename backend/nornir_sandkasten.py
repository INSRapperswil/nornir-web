from nornir import InitNornir


# TODO Config-Options
# - Runner
# - Num Workers
# - Inventory Host/Group-File
# - logging level
# - logging file
# - logging format

def load_inventory(group_file, host_file):
    if group_file is not None and host_file is not None:
        return {'plugin': 'SimpleInventory',
                'options': {
                    'host_file': host_file,
                    'group_file': group_file
                }}


def main():
    # group_file = 'web_nornir/nornir_config/other_config/groups.yaml'
    group_file = None
    host_file = 'web_nornir/nornir_config/other_config/hosts.yaml'

    # If group file or host file are missing, defaulting to the inventory in configuration
    nr = InitNornir(
        config_file='web_nornir/nornir_config/configuration.yaml',
        inventory=load_inventory(group_file=group_file, host_file=host_file),

    )
    print(nr.config.runner.options['num_workers'])
    print(nr.config.inventory.options['host_file'])
    print(nr.config.inventory.options['group_file'])


if __name__ == "__main__":
    main()
