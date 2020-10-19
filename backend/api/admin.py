from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin

from api import models


# TODO: Breaks login function. Users from Group superuser can not login, somehow restricted to is_staff == true
class GroupBasedAdminSite(AdminSite):
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
    # Settings for Overview
    list_display = ('name', 'package_path', 'file_name', 'function_name', 'created_by')
    list_filter = ['created_by']
    search_fields = ['name', 'description']

    # Settings for detail view
    fieldsets = [
        (
            'Title & Description',
            {'fields': ['name', 'description']}
        ),
        (
            'Module Name & Path',
            {'fields': ['package_path', 'file_name', 'function_name']}
        ),
        (
            'Author',
            {'fields': ['created_by']}
        )
    ]


class TaskAdmin(admin.ModelAdmin):
    # Settings for Overview
    list_display = ('name', 'status', 'created_by', 'template', 'inventory', 'celery_task_id')
    list_filter = ['created_by', 'template', 'inventory']
    search_fields = ['name', 'status', 'template']

    # Settings for detail view
    fieldsets = [
        (
            'Title',
            {'fields': ['name']}
        ),
        (
            'Schedules & Status',
            {'classes': ('collapse',),
             'fields': ['status', 'date_scheduled', 'date_started', 'date_finished']}
        ),
        (
            'Filters, Variables, Results',
            {'fields': ['filters', 'variables', 'result', 'result_host_selection']}
        ),
        (
            'Dependencies',
            {'fields': ['template', 'inventory', 'created_by']}
        )
    ]

    readonly_fields = ['date_scheduled', 'date_started', 'date_finished', 'status', 'result']


class InventoryAdmin(admin.ModelAdmin):
    # Settings for Overview
    list_display = ('name', 'type', 'hosts_file', 'groups_file')
    list_filter = ['type']
    search_fields = ['name', 'hosts_file', 'groups_file']

    # Settings for detail view
    fieldsets = [
        (
            'Name & Type',
            {'fields': ['name', 'type']}
        ),
        (
            'Configuration Files',
            {'fields': ['hosts_file', 'groups_file']}
        )
    ]


admin.site.register(models.JobTemplate, JobTemplateAdmin)
admin.site.register(models.Task, TaskAdmin)
admin.site.register(models.Inventory, InventoryAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
