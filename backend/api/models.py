from django.db import models
from django.contrib.auth.models import User


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
    variables = models.TextField()
    input = models.TextField()
    result = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(JobTemplate, on_delete=models.SET_NULL, null=True)


class Inventory(models.Model):
    name = models.CharField(max_length=200)
    hosts_file = models.TextField()
    groups_file = models.TextField()


class InventoryFilter(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    filter = models.TextField()
