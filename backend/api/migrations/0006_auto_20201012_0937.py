# Generated by Django 3.1.2 on 2020-10-12 09:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_merge_20201012_0912'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='input',
            new_name='resultHostSelection',
        ),
        migrations.AddField(
            model_name='task',
            name='filters',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='InventoryFilter',
        ),
    ]
