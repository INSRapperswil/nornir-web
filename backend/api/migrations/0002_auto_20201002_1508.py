# Generated by Django 3.1.1 on 2020-10-02 13:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='date_schedule',
            new_name='date_scheduled',
        ),
    ]
