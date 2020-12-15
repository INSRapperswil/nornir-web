import pytest
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from mixer.backend.django import mixer
from pytest_drf import APIViewTest, UsesGetMethod, Returns200, AsUser
from pytest_lambda import lambda_fixture

from api.models import Task
from api.tests.expected_data import *

pytestmark = pytest.mark.django_db

user = lambda_fixture(
    lambda: User.objects.get(username='thomastest')
)


class TestTaskModel(TestCase):
    def test_add_task(self):
        schedule = timezone.now()
        mixer.blend(Task, name='Update Cisco Firmware', date_scheduled=schedule)
        task_result = Task.objects.last()
        assert task_result.name == 'Update Cisco Firmware'
        assert task_result.date_scheduled == schedule


class TestTaskApi(APIViewTest, UsesGetMethod, Returns200, AsUser('user')):
    url = lambda_fixture(lambda: reverse('task-list'))

    def test_task_list(self, json):
        actual = json
        assert expected_task_list == actual
