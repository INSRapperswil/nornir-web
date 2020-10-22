from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'inventories', views.InventoryViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'templates', views.JobTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # TODO: Path configuration is not discovered by DRF in API Root and Swagger
    path('configuration/', views.ConfigurationView.as_view()),
]
