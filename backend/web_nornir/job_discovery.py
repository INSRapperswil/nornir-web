import pkgutil
import importlib


def get_job_definitions():
    job_definitions = []
    for job in pkgutil.walk_packages(['job_templates']):
        task = importlib.import_module('.' + job.name, 'web_nornir.job_templates')
        job_definitions.append(getattr(task, 'job_definition'))
    return job_definitions


def get_job_function(name: str):
    job = list(filter(lambda x: x.name == name, pkgutil.walk_packages(['job_templates'])))
    return getattr(importlib.import_module('.' + job[0].name, 'web_nornir.job_templates'), 'job_function')
