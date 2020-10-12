from django.db import models
from django.contrib.auth.models import User
from nornir.core.task import AggregatedResult
from web_nornir.nornir_handler import NornirHandler


# Create your models here.


class JobTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    file_path = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)


class Task(models.Model):
    class Status(models.IntegerChoices):
        SCHEDULED = 1
        RUNNING = 2
        FINISHED = 3
        FAILED = 4
        ABORTED = 5

    name = models.CharField(max_length=200)
    status = models.IntegerField(choices=Status.choices, default=Status.SCHEDULED)
    date_scheduled = models.DateTimeField('Date Scheduled')
    date_started = models.DateTimeField('Date Started', null=True)
    date_finished = models.DateTimeField('Date Finished', null=True)
    variables = models.JSONField(default=dict, null=True)
    input = models.TextField(default=dict, null=True)
    result = models.JSONField(default=dict, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(JobTemplate, on_delete=models.SET_NULL, null=True)

    @staticmethod
    def run_task(data):
        nr = NornirHandler()
        result: AggregatedResult = nr.execute_task(data['template']['name'], data['params'], data['inventorySelection'])
        return result


class Inventory(models.Model):
    class InventoryType(models.IntegerChoices):
        SIMPLE = 1

    name = models.CharField(max_length=200)
    type = models.IntegerField(choices=InventoryType.choices, default=InventoryType.SIMPLE)
    hosts_file = models.TextField()
    groups_file = models.TextField()

    # In Zukunft umbauen, so dass die entsprechenden Properties des Inventory übergeben werden
    # Aktuell alles hardwired (auch in NornirHandler)
    @staticmethod
    def get_hosts():
        nh = NornirHandler()
        return nh.get_hosts()

    @staticmethod
    def get_groups():
        nh = NornirHandler()
        return nh.get_groups()


class InventoryFilter(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    filter = models.TextField()
