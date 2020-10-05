from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
from rest_framework.response import Response

from api.models import Task, JobTemplate, Inventory, InventoryFilter
from api.serializers import TaskSerializer, JobTemplateSerializer, InventorySerializer, InventoryFilterSerializer, \
    UserSerializer


# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class JobTemplateViewSet(viewsets.ModelViewSet):
    queryset = JobTemplate.objects.all()
    serializer_class = JobTemplateSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.DjangoModelPermissions]

    # TODO: get list of all hosts for given inventory
    # def get_hosts(self, request, pk):
    #     inventory = self.get_object()
    #     inventory.get_hosts()
    #     return Response(HostSerializer(inventory).data)


class InventoryFilterViewSet(viewsets.ModelViewSet):
    queryset = InventoryFilter.objects.all()
    serializer_class = InventoryFilterSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides 'list' and 'detail' actions
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissions]
