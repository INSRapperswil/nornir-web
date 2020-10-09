"""
Setup DB with example data for tests
"""
from datetime import datetime

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password
from api import models


class Command(BaseCommand):
    help = 'Setup DB with example data for tests'

    def handle(self, *args, **options):
        # Create User
        User.objects.get_or_create(username='thomastest', password=make_password('imatestin'))

        user = User.objects.get(username='thomastest')
        group = Group.objects.get(name='superuser')
        group.user_set.add(user)

        # Create Inventory
        models.Inventory.objects.create(name='Base', hosts_file='hosts.yml', groups_file='groups.yml', type=1)

        # Create Template
        models.JobTemplate.objects.create(name='Hello World', description='This prints a hello world',
                                          file_path='helo.py')
        models.JobTemplate.objects.create(name='Update Firmware', description='Updates Cisco Firmware',
                                          file_path='update_cisco.py')

        # Create Task
        models.Task.objects.create(name='Get Hello World', date_scheduled=datetime.utcnow(), created_by_id=1,
                                   template_id=1)

        # Create InventoryFilter
        models.InventoryFilter.objects.create(inventory_id=1, task_id=2, filter='filter(site="cmh", role="host")')
        models.InventoryFilter.objects.create(inventory_id=1, task_id=1, filter='filter(platform="ios", role="host")')
