"""
Create permission groups
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group

GROUPS = ['superuser', 'netadmin', 'support']


class Command(BaseCommand):
    help = 'Creates read only default permission groups for users'

    def handle(self, *args, **options):
        for group in GROUPS:
            Group.objects.get_or_create(name=group)

        # TODO: Add permissions to groups.

        print("Created default group.")
