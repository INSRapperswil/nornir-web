from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from api.models import Task, JobTemplate, Inventory


class TaskSerializer(serializers.ModelSerializer):
    created_name = serializers.ReadOnlyField(source='created_by.username')
    detail = serializers.HyperlinkedIdentityField(view_name='task-detail', read_only=True)
    template_name = serializers.ReadOnlyField(source='template.name')
    inventory_name = serializers.ReadOnlyField(source='inventory.name')

    class Meta:
        model = Task
        fields = [
            'id',
            'detail',
            'name',
            'status',
            'date_scheduled',
            'date_started',
            'date_finished',
            'variables',
            'result_host_selection',
            'filters',
            'result',
            'created_by',
            'created_name',
            'template',
            'template_name',
            'inventory',
            'inventory_name',
            'is_template'
        ]


class JobTemplateSerializer(serializers.ModelSerializer):
    created_name = serializers.ReadOnlyField(source='created_by.username')
    detail = serializers.HyperlinkedIdentityField(view_name='jobtemplate-detail', read_only=True)

    class Meta:
        model = JobTemplate
        fields = [
            'id',
            'detail',
            'name',
            'description',
            'variables',
            'file_name',
            'package_path',
            'function_name',
            'created_by',
            'created_name'
        ]


class InventorySerializer(serializers.ModelSerializer):
    detail = serializers.HyperlinkedIdentityField(view_name='inventory-detail', read_only=True)

    class Meta:
        model = Inventory
        fields = [
            'id',
            'detail',
            'name',
            'type',
            'hosts_file',
            'groups_file',
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'groups']


class EnhancedTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['groups'] = list(user.groups.values_list('name', flat=True))
        return token
