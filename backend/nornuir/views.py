from django.contrib.auth.models import User
from rest_framework.viewsets import ReadOnlyModelViewSet

from nornuir.serializers import UserSerializer

# Create your views here.

class UserViewSet(ReadOnlyModelViewSet):
    """
    This viewset automatically provides 'list' and 'detail' actions
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
