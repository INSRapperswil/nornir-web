from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import TaskViewSet, UserViewSet

app_name = 'api'

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register('users', UserViewSet)
router.register('tasks', TaskViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = router.urls