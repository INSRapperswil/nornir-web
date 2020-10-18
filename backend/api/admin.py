from django.contrib import admin
from api import models


# Register your models here.

class JobTemplateAdmin(admin.ModelAdmin):
    # Settings for Overview
    list_display = ('name', 'description', 'file_path', 'created_by')
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
            {'fields': ['file_path']}
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
            {'fields': ['date_scheduled', 'date_started', 'date_finished', 'status']}
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
