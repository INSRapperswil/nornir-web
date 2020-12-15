from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User, Group

from api import models


class GroupBasedAdminSite(AdminSite):
    """
    Custom Admin Site which allows users with is_staff property or group 'superuser' to access the admin panel.
    Overrides login_form to use the _default_ AuthenticationForm instead of AdminAuthenticationForm.
    This will allow every user to login, but with our custom has_permission method below, access is still restricted.
    """

    login_form = AuthenticationForm

    def has_permission(self, request):
        # If Django Superuser (is_staff, is_superuser == true
        if request.user.is_active and request.user.is_staff and request.user.is_superuser:
            return True
        # Web Nornir User in superuser group
        elif request.user.is_active and request.user.groups.filter(name='superuser').exists():
            return True
        else:
            return False


# override default admin site
admin.site = GroupBasedAdminSite()


class JobTemplateAdmin(admin.ModelAdmin):
    readonly_fields = ['id']

    # Settings for Overview
    list_display = ['id', 'name', 'package_path', 'file_name', 'function_name', 'created_by']
    list_display_links = ['id', 'name']
    list_filter = ['created_by']
    ordering = ['id']
    search_fields = ['name', 'description']

    # Settings for detail view
    fieldsets = [
        (
            'Title & Description',
            {'fields': ['id', 'name', 'description']}
        ),
        (
            'Module Name & Path',
            {'fields': ['package_path', 'file_name', 'function_name', 'variables']}
        ),
        (
            'Author',
            {'fields': ['created_by']}
        )
    ]


class TaskAdmin(admin.ModelAdmin):
    readonly_fields = ['id', 'date_scheduled', 'date_started', 'date_finished', 'status', 'result']

    # Settings for Overview
    list_display = ['id', 'name', 'status', 'created_by', 'template', 'inventory', 'is_template', 'celery_task_id']
    list_display_links = ['id', 'name']
    list_filter = ['created_by', 'template', 'inventory']
    ordering = ['id']
    search_fields = ['name', 'status', 'template']

    # Settings for detail view
    fieldsets = [
        (
            'Title',
            {'fields': ['id', 'name']}
        ),
        (
            'Schedules & Status',
            {'classes': ('collapse',),
             'fields': ['status', 'date_scheduled', 'date_started', 'date_finished']}
        ),
        (
            'Filters, Variables, Results',
            {'fields': ['is_template', 'filters', 'variables', 'result']}
        ),
        (
            'Dependencies',
            {'fields': ['template', 'inventory', 'created_by']}
        )
    ]


class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ['id']

    # Settings for Overview
    list_display = ['id', 'name', 'type', 'hosts_file', 'groups_file']
    list_display_links = ['id', 'name']
    list_filter = ['type']
    ordering = ['id']
    search_fields = ['name', 'hosts_file', 'groups_file', 'defaults_file']

    # Settings for detail view
    fieldsets = [
        (
            'Name & Type',
            {'fields': ['id', 'name', 'type']}
        ),
        (
            'Configuration Files',
            {'fields': ['hosts_file', 'groups_file', 'defaults_file']}
        )
    ]


admin.site.register(models.JobTemplate, JobTemplateAdmin)
admin.site.register(models.Task, TaskAdmin)
admin.site.register(models.Inventory, InventoryAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
