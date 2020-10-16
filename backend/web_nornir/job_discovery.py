import pkgutil
import importlib.util
import web_nornir.job_templates


class JobDiscovery:
    def __init__(self, module=None):
        if module is None:
            self.module_path = web_nornir.job_templates.__path__
        else:
            self.module_path = module

    def get_job_definitions(self):
        job_definitions = []
        for job in pkgutil.walk_packages(self.module_path):
            spec = importlib.util.spec_from_file_location(job.name, f'{self.module_path[0]}/{job.name}.py')
            task = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(task)
            job_definitions.append(getattr(task, 'job_definition'))
        return job_definitions

    def get_job_function(self, file_name: str, function_name: str):

        job = list(filter(lambda x: x.name == file_name, pkgutil.walk_packages([self.module_path])))
        if job:
            spec = importlib.util.spec_from_file_location(file_name, f'{self.module_path}/{file_name}.py')
            task = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(task)
            return getattr(task, function_name)
        else:
            raise Exception(f'job template "{file_name}" not found')
