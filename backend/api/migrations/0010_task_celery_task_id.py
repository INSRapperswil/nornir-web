# Generated by Django 3.1.2 on 2020-10-12 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20201012_0950'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='celery_task_id',
            field=models.CharField(blank=True, max_length=40),
        ),
    ]
