# Generated by Django 3.1.2 on 2020-11-14 00:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_merge_20201102_1115'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='is_template',
            field=models.BooleanField(default=False),
        ),
    ]
