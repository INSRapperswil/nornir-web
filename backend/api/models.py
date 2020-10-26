from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from nornir.core.task import AggregatedResult
from web_nornir.nornir_handler import NornirHandler
from celery import shared_task
from backend.settings import BASE_DIR


# Create your models here.


class JobTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True)
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

    def __str__(self):
        return f'{self.id}: {self.name}'

    def get_hosts(self):
        nh = NornirHandler(self.hosts_file, self.groups_file)
        return nh.get_hosts()

    def get_groups(self):
        nh = NornirHandler(self.hosts_file, self.groups_file)
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
    variables = models.JSONField(default=dict, null=True)
    filters = models.JSONField(default=dict, null=True)
    result_host_selection = models.TextField(null=True)
    result = models.JSONField(default=dict, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(JobTemplate, on_delete=models.SET_NULL, null=True)
    inventory = models.ForeignKey(Inventory, on_delete=models.SET_NULL, null=True)
    celery_task_id = models.CharField(blank=True, max_length=40)

    def __str__(self):
        return f'{self.id}: {self.name}'

    def schedule(self):
        self.status = self.Status.SCHEDULED
        self.save()
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
        nr = NornirHandler(self.inventory.hosts_file, self.inventory.groups_file)
        self.start()
        self.variables['name'] = self.name
        self.save()
        task_result: AggregatedResult = nr.execute_task(self.template, self.variables, self.filters)
        self.finish(task_result)
        self.save()

    def start(self):
        self.status = self.Status.RUNNING
        self.date_started = timezone.now()

    def finish(self, result):
        self.result: dict = result.__dict__
        if result.failed:
            self.status = self.Status.FAILED
        else:
            self.status = self.Status.FINISHED
        self.date_finished = timezone.now()


class Configuration:
    @staticmethod
    def get():
        return NornirHandler.get_configuration()

    @staticmethod
    def set(new_configuration):
        return NornirHandler.set_configuration(new_configuration)
