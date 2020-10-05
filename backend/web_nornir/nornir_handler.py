from nornir import InitNornir


class NornirHandler:
    def __init__(self, config="nornir_config/config.yaml"):
        self.nr = InitNornir(config_file=config)

    def get_hosts(self):
        return self.nr.inventory.hosts

    def get_groups(self):
        return self.nr.inventory.groups

    def execute_task(self, params: dict):
        return self.nr.run(params)
