# Generated by Django 3.1.2 on 2020-10-19 07:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20201016_1737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='groups_file',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='inventory',
            name='hosts_file',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='jobtemplate',
            name='description',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='jobtemplate',
            name='file_name',
            field=models.CharField(max_length=256),
        ),
        migrations.AlterField(
            model_name='jobtemplate',
            name='function_name',
            field=models.CharField(default='job_function', max_length=256),
        ),
        migrations.AlterField(
            model_name='jobtemplate',
            name='package_path',
            field=models.CharField(default='/web_nornir/job_templates/', max_length=256),
        ),
    ]