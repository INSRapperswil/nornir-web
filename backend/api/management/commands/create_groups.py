"""
Create permission groups.
"""
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

GROUPS = ['superuser', 'netadmin', 'support']
MODELS = ContentType.objects.filter(app_label='api').all()
PERMISSIONS = Permission.objects.filter(content_type__app_label='api').all()


class Command(BaseCommand):
    help = 'This script prepares the groups and permissions for Web-Nornir\n' \
           '- Group "Superuser": Can read and write on all API nodes.\n' \
           '- Group "Netadmin": Can read on all API nodes, can write on API node "task", "inventoryfilter".\n' \
           '- Group "Support": Can only read on all API nodes.\n'

    def handle(self, *args, **options):
        for group in GROUPS:
            Group.objects.get_or_create(name=group)

        # TODO: Add permissions to groups.

        print("Created default group.")
