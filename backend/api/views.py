from django.contrib.auth.models import User
from django.core.serializers import serialize
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Task, JobTemplate, Inventory, InventoryFilter
from api.serializers import TaskSerializer, JobTemplateSerializer, InventorySerializer, InventoryFilterSerializer, \
    UserSerializer


# Create your views here.

class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet which lists all tasks known to the system
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    @action(detail=False, methods=['POST'])
    def run(self, request):
        data = request.data
        result = Task.run_task(data)
        if result.items():
            return Response(result.__dict__)
        else:
            return Response('no result objects in AggregatedResult')


class JobTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet lists all job templates available for usage
    """
    queryset = JobTemplate.objects.all()
    serializer_class = JobTemplateSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class InventoryViewSet(viewsets.ModelViewSet):
    """
    Inventory ViewSet which shows configured inventories and allows to list hosts and groups information
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.DjangoModelPermissions]

    @action(detail=True, methods=['GET'])
    def hosts(self, request, pk):
        inventory = self.get_object()
        hosts = inventory.get_hosts()
        return Response(hosts)

    @action(detail=True, methods=['GET'])
    def groups(self, request, pk):
        inventory = self.get_object()
        groups = inventory.get_groups()
        return Response(groups)


class InventoryFilterViewSet(viewsets.ModelViewSet):
    """
    ViewSet which shows all Filters over inventories which have been applied to tasks
    """
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
