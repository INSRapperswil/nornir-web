from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    # link users to all tasks he created
    # tasks = serializers.HyperlinkedRelatedField(many=True, view_name='tasks-detail', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username']  # , 'tasks']
