from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Task, JobTemplate, Inventory, InventoryFilter


class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    detail = serializers.HyperlinkedIdentityField(view_name='task-detail', read_only=True)

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
            'input',
            'result',
            'created_by',
            'template'
        ]


class JobTemplateSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    detail = serializers.HyperlinkedIdentityField(view_name='jobtemplate-detail', read_only=True)

    class Meta:
        model = JobTemplate
        fields = [
            'id',
            'detail',
            'name',
            'description',
            'file_path',
            'created_by'
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


class InventoryFilterSerializer(serializers.ModelSerializer):
    detail = serializers.HyperlinkedIdentityField(view_name='inventoryfilter-detail', read_only=True)

    class Meta:
        model = InventoryFilter
        fields = [
            'id',
            'detail',
            'inventory',
            'task',
            'filter'
        ]


class UserSerializer(serializers.ModelSerializer):
    # Linking from User to all templates he created, not working right now.
    # templates = serializers.HyperlinkedRelatedField(many=True, view_name='template-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username']  # , 'templates']
