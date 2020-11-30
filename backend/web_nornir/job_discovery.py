import pkgutil
import importlib.util
import web_nornir.job_templates


class JobDiscovery:
    def __init__(self, module: str = None):
        if module is None:
            self.module_path = web_nornir.job_templates.__path__[0]
        else:
            self.module_path = module

    def get_job_function(self, file_name: str, function_name: str):
        spec = importlib.util.spec_from_file_location(file_name, f'{self.module_path}/{file_name}')
        if spec:
            task = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(task)
            return getattr(task, function_name)
        else:
            raise Exception(f'job template "{file_name}" not found')
