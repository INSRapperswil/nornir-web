# Generated by Django 3.1.2 on 2020-10-23 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20201019_0928'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jobtemplate',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='filters',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='result',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='result_host_selection',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='variables',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
