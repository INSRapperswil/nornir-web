# Generated by Django 3.1.2 on 2020-10-09 10:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_task_template'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='type',
            field=models.IntegerField(choices=[(1, 'Simple')], default=1),
        ),
    ]