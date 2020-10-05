from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TaskViewSet, UserViewSet, InventoryViewSet, InventoryFilterViewSet, JobTemplateViewSet

app_name = 'api'

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register('inventories', InventoryViewSet)
router.register('inventoryfilters', InventoryFilterViewSet)
router.register('users', UserViewSet)
router.register('tasks', TaskViewSet)
router.register('templates', JobTemplateViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = router.urls