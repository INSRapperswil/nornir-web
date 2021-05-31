from django.contrib.auth.models import Group
from rest_framework import permissions


class ConfigurationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        """
        Allows GET, HEAD, OPTIONS for all authenticated users, but POST only for superusers oder django superusers
        """

        if request.method in permissions.SAFE_METHODS and request.user.is_authenticated:
            return True

        return Group.objects.get(name='superuser').user_set.filter(
            id=request.user.id).exists() or request.user.is_superuser
