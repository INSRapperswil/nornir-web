# Generated by Django 3.1.2 on 2020-10-12 09:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20201012_0937'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='resultHostSelection',
            new_name='result_host_selection',
        ),
    ]
