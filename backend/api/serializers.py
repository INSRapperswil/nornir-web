from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Task, JobTemplate, Inventory, InventoryFilter


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'name',
            'status',
            'date_scheduled',
            'date_started',
            'date_finished',
            'variables',
            'input',
            'result',
            'created_by'
        ]


class JobTemplateSerializer(serializers.ModelSerializer):


    class Meta:
        model = JobTemplate
        fields = [
            'name',
            'description',
            'file_path',
            'created_by'
        ]


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = [
            'name',
            'hosts_file',
            'groups_file',
        ]


class InventoryFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryFilter
        fields = [
            'inventory',
            'task',
            'filter'
        ]


class UserSerializer(serializers.ModelSerializer):
    # link users to all tasks he created
    # tasks = serializers.HyperlinkedRelatedField(many=True, view_name='tasks-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username']  # , 'tasks']
