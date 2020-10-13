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

        print('----    Creating Users    ----')
        User.objects.get_or_create(username='thomastest', password=make_password('imatestin'))
        thomas = User.objects.get(username='thomastest')

        User.objects.get_or_create(username='norbert', password=make_password('netzwerk'))
        norbert = User.objects.get(username='norbert')

        User.objects.get_or_create(username='stefan', password=make_password('helldesk'))
        stefan = User.objects.get(username='stefan')

        superuser = Group.objects.get(name='superuser')
        superuser.user_set.add(thomas)

        netadmin = Group.objects.get(name='netadmin')
        netadmin.user_set.add(norbert)

        support = Group.objects.get(name='support')
        support.user_set.add(stefan)

        print('----    Creating Inventory    ----')
        models.Inventory.objects.create(name='Base', hosts_file='hosts.yml', groups_file='groups.yml', type=1)

        print('----    Creating Job Templates    ----')
        models.JobTemplate.objects.create(name='hello_world', description='This prints a hello world',
                                          file_path='helo.py')
        models.JobTemplate.objects.create(name='Update Firmware', description='Updates Cisco Firmware',
                                          file_path='update_cisco.py')

        print('----    Creating Tasks    ----')
        models.Task.objects.create(name='Get Hello World', date_scheduled='2020-10-09T15:52:52.650855Z', created_by_id=2,
                                   template_id=1)
        models.Task.objects.create(name='Update Firmware', date_scheduled='2020-10-09T15:52:52.657905Z', created_by_id=1,
                                   template_id=2)

        print('----    ALL DONE!!    ----')