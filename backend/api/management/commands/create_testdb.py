"""
Setup DB with example data for tests
"""

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
        models.Inventory.objects.create(name='Example', hosts_file='web_nornir/nornir_config/example_config/hosts.yaml',
                                        groups_file='web_nornir/nornir_config/example_config/groups.yaml', type=1)
        models.Inventory.objects.create(name='INS Lab', hosts_file='web_nornir/nornir_config/inslab_config/hosts.yaml',
                                        groups_file='web_nornir/nornir_config/inslab_config/groups.yaml', type=1)

        print('----    Creating Job Templates    ----')
        models.JobTemplate.objects.create(name='hello_world', description='This prints a hello world',
                                          file_name='hello_world.py', created_by_id=1)
        models.JobTemplate.objects.create(name='Get CDP Neighbors', description='Lists all CDP neighbors',
                                          file_name='get_cdp_neighbors.py', created_by_id=1)
        models.JobTemplate.objects.create(name='Get Interfaces',
                                          description='Gets brief information about all interfaces, sh ip int br',
                                          file_name='get_interfaces.py', created_by_id=1)
        models.JobTemplate.objects.create(name='Ping Device',
                                          description='Pings a chosen network device and reports if reachable',
                                          file_name='ping.py', created_by_id=1)

        print('----    Creating Tasks    ----')
        models.Task.objects.create(name='Get Hello World', created_by_id=1, template_id=1, inventory_id=1)
        models.Task.objects.create(name='Get CDP neighbors of INS lab', created_by_id=2, template_id=2, inventory_id=2)
        models.Task.objects.create(name='Get interfaces of INS lab', created_by_id=2, template_id=3, inventory_id=2)

        print('----    ALL DONE!!    ----')
