from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Task, JobTemplate, Inventory, Configuration
from api.serializers import TaskSerializer, JobTemplateSerializer, InventorySerializer, UserSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet which lists all tasks known to the system
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    @action(detail=True, methods=['POST'])
    def run(self, request, pk):
        task = self.get_object()
        task.run_task()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def run_async(self, request, pk):
        task = self.get_object()
        task.schedule()
        return Response(status=status.HTTP_202_ACCEPTED)


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

    # allows url pattern: /api/inventory/{inventory_id}/host/{name}
    @action(detail=True, methods=['GET'], name='hosts', url_path='hosts/(?P<name>[a-z0-9]+)')
    def host_detail(self, request, pk, name=None):
        inventory = self.get_object()
        try:
            host_detail = inventory.get_host_detail(name)
            return Response(host_detail)
        except LookupError:
            raise Http404

    @action(detail=True, methods=['GET'])
    def groups(self, request, pk):
        inventory = self.get_object()
        groups = inventory.get_groups()
        return Response(groups)


class UserViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides 'list' and 'detail' actions
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.DjangoModelPermissions]


class ConfigurationView(viewsets.ViewSet):
    """
    Shows the global Nornir configuration and allows to set the configuration
    """

    def list(self, request, format=None):
        configuration = Configuration.get()
        return Response(configuration)

    def create(self, request, format=None):
        configuration = Configuration.set(request.data)
        return Response(configuration)
