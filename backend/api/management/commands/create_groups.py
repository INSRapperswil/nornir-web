"""
Create permission groups.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

GROUPS = ['superuser', 'netadmin', 'support']
PERMISSIONS_ALL = Permission.objects.filter(content_type__app_label='api').all()
PERMISSIONS_TASKS = Permission.objects.filter(content_type__app_label='api', name__contains='task').all()
PERMISSIONS_READ = Permission.objects.filter(content_type__app_label='api', name__contains='view').all()


class Command(BaseCommand):
    help = 'This script prepares the groups and permissions for Web-Nornir\n' \
           '- Group "Superuser": Can read and write on all API nodes.\n' \
           '- Group "Netadmin": Can read on all API nodes, can write on API node "task".\n' \
           '- Group "Support": Can only read on all API nodes.\n'

    def handle(self, *args, **options):
        for group in GROUPS:
            new_group, created = Group.objects.get_or_create(name=group)

            if group == 'superuser':
                for permission in PERMISSIONS_ALL:
                    new_group.permissions.add(permission)

            if group == 'netadmin':
                for permission in PERMISSIONS_READ:
                    new_group.permissions.add(permission)
                for permission in PERMISSIONS_TASKS:
                    new_group.permissions.add(permission)

            if group == 'support':
                for permission in PERMISSIONS_READ:
                    new_group.permissions.add(permission)

        print("Created groups and loaded with permissions.")
