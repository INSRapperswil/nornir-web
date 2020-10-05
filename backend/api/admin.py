from django.contrib import admin
from api import models

# Register your models here.

admin.site.register(models.JobTemplate)
admin.site.register(models.Task)
admin.site.register(models.Inventory)
admin.site.register(models.InventoryFilter)
