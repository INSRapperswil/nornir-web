# Generated by Django 3.1.2 on 2020-10-30 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20201023_1614'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='defaults_file',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
