from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView

from api.models import Task, JobTemplate, Inventory, Configuration
from api.permissions import ConfigurationPermission
from api.serializers import TaskSerializer, JobTemplateSerializer, InventorySerializer, UserSerializer, \
    EnhancedTokenObtainPairSerializer
from api.inventory_helpers import InventoryPagination, InventoryOrdering


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet which lists all tasks known to the system
    """
    queryset = Task.objects.all().order_by('-id')
    serializer_class = TaskSerializer
    permission_classes = [permissions.DjangoModelPermissions]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'template__name', 'inventory__name', 'created_by__username', 'is_template']
    search_fields = ['name']
    ordering_fields = ['id', 'name', 'status', 'date_scheduled', 'date_started', 'date_finished', 'inventory']

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
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['file_name', 'function_name', 'package_path', 'created_by__username']
    search_fields = ['name', 'function_name', 'file_name']
    ordering_fields = ['id', 'name', 'package_path', 'file_name', 'function_name', 'created_by__username']


class InventoryViewSet(viewsets.ModelViewSet):
    """
    Inventory ViewSet which shows configured inventories and allows to list hosts and groups information
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.DjangoModelPermissions]
    pagination_class = InventoryPagination
    filterset_fields = ['groups__contains', 'platform__contains', 'name__contains', 'hostname__contains']
    ordering_fields = ['name', 'hostname', 'platform']

    @action(detail=True, methods=['GET'])
    def hosts(self, request, pk):
        self.search_fields = ['name__contains', 'hostname__contains']
        inventory = self.get_object()
        query_params = []
        for key, value in request.query_params.items():
            query_params.append({key: value}) if key in self.filterset_fields and value else None
        search = request.query_params['search'] if 'search' in request.query_params else ''
        queryset = inventory.get_hosts(query_params, self.search_fields, search)
        queryset = InventoryOrdering().filter_queryset(request, queryset, self)
        paginator = self.pagination_class()
        data = paginator.paginate_queryset(queryset=queryset, request=request)
        return paginator.get_paginated_response(data)

    # allows url pattern: /api/inventory/{inventory_id}/host/{name}
    @action(detail=True, methods=['GET'], name='hosts', url_path='hosts/(?P<name>[a-z0-9.-]+)')
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

    permission_classes = [ConfigurationPermission]

    def list(self, request, format=None):
        configuration = Configuration.get()
        return Response(configuration)

    def create(self, request, format=None):
        configuration = Configuration.set(request.data)
        return Response(configuration)


class EnhancedTokenObtainPairView(TokenObtainPairView):
    serializer_class = EnhancedTokenObtainPairSerializer
