from django.urls import path, include
from rest_framework.routers import DefaultRouter
from nornuir.views import UserViewSet

app_name = 'nornuir'

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register('users', UserViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = router.urls