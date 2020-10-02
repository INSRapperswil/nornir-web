from django.db import models


# Create your models here.

class Task(models.Model):
    name = models.CharField(max_length=200)
    date_schedule = models.DateTimeField('Date Scheduled')
