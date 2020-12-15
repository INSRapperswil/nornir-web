from celery import shared_task
from celery.contrib.abortable import AsyncResult
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from backend.settings import BASE_DIR
from web_nornir.nornir_handler import NornirHandler


class JobTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    variables = models.JSONField(default=list, blank=True, null=True)
    package_path = models.CharField(max_length=256, default='/web_nornir/job_templates/')
    file_name = models.CharField(max_length=256)
    function_name = models.CharField(max_length=256, default='job_function')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f'{self.id}: {self.name}'

    def get_package_path(self):
        return str(BASE_DIR.as_posix()) + self.package_path


class Inventory(models.Model):
    class InventoryType(models.IntegerChoices):
        SIMPLE = 1

    name = models.CharField(max_length=200)
    type = models.IntegerField(choices=InventoryType.choices, default=InventoryType.SIMPLE)
    hosts_file = models.CharField(max_length=256)
    groups_file = models.CharField(max_length=256)
    defaults_file = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return f'{self.id}: {self.name}'

    def get_hosts(self, filter_arguments=None, search_fields=None, search_argument=''):
        nh = NornirHandler(self.hosts_file, self.groups_file, self.defaults_file)
        return nh.get_hosts(filter_arguments, search_fields, search_argument)

    def get_host_detail(self, name):
        nh = NornirHandler(self.hosts_file, self.groups_file, self.defaults_file)
        return nh.get_host_detail(name)

    def get_groups(self):
        nh = NornirHandler(self.hosts_file, self.groups_file, self.defaults_file)
        return nh.get_groups()


class Task(models.Model):
    class Status(models.IntegerChoices):
        CREATED = 0
        SCHEDULED = 1
        RUNNING = 2
        FINISHED = 3
        FAILED = 4
        ABORTED = 5

    name = models.CharField(max_length=200)
    status = models.IntegerField(choices=Status.choices, default=Status.CREATED)
    date_scheduled = models.DateTimeField('Date Scheduled', null=True)
    date_started = models.DateTimeField('Date Started', null=True)
    date_finished = models.DateTimeField('Date Finished', null=True)
    variables = models.JSONField(default=dict, blank=True, null=True)
    filters = models.JSONField(default=dict, blank=True, null=True)
    result = models.JSONField(default=dict, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(JobTemplate, on_delete=models.SET_NULL, null=True)
    inventory = models.ForeignKey(Inventory, on_delete=models.SET_NULL, null=True)
    celery_task_id = models.CharField(blank=True, max_length=40)
    is_template = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.id}: {self.name}'

    def schedule(self):
        self.status = self.Status.SCHEDULED
        if self.date_scheduled:
            self.celery_task_id = self.run_task_async.apply_async(eta=self.date_scheduled, args=[self.id])
        else:
            self.celery_task_id = self.run_task_async.apply_async(args=[self.id])
        self.save()

    @staticmethod
    @shared_task
    def run_task_async(task_id):
        task = Task.objects.filter(id=task_id).get()
        task.run_task()

    def run_task(self):
        nr = NornirHandler(self.inventory.hosts_file, self.inventory.groups_file, self.inventory.defaults_file)
        self.start()
        self.variables['name'] = self.name
        self.save()
        task_result = nr.execute_task(self.template, self.variables, self.filters)
        self.finish(task_result)
        self.save()

    def start(self):
        self.status = self.Status.RUNNING
        self.date_started = timezone.now()

    def finish(self, result):
        self.result = result

        if result['failed']:
            self.status = self.Status.FAILED
        else:
            self.status = self.Status.FINISHED
        self.date_finished = timezone.now()

    def abort(self):
        if self.celery_task_id == '' or self.status not in [self.Status.SCHEDULED, self.Status.RUNNING]:
            return
        AsyncResult(self.celery_task_id).revoke()
        self.status = self.Status.ABORTED
        self.save()


class Configuration:
    @staticmethod
    def get():
        return NornirHandler.get_configuration()

    @staticmethod
    def set(new_configuration):
        return NornirHandler.set_configuration(new_configuration)
