from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api import views

# Only registered Viewsets will show in browsable API
router = DefaultRouter()
router.register(r'configuration', views.ConfigurationView, basename='configuration')
router.register(r'inventories', views.InventoryViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'templates', views.JobTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
