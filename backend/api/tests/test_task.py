import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from django.test import TestCase
from mixer.backend.django import mixer
from pytest_drf import APIViewTest, UsesGetMethod, Returns200, AsUser
from pytest_lambda import lambda_fixture

from api.models import Task

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
        expected = [
            {'created_by': 'norbert',
             'date_finished': None,
             'date_scheduled': '2020-10-09T15:52:52.650855Z',
             'date_started': None,
             'detail': 'http://testserver/api/tasks/1/',
             'id': 1,
             'input': '',
             'name': 'Get Hello World',
             'result': '',
             'status': 1,
             'variables': ''},
            {'created_by': 'thomastest',
             'date_finished': None,
             'date_scheduled': '2020-10-09T15:52:52.657905Z',
             'date_started': None,
             'detail': 'http://testserver/api/tasks/2/',
             'id': 2,
             'input': '',
             'name': 'Update Firmware',
             'result': '',
             'status': 1,
             'variables': ''},
        ]
        actual = json
        assert expected == actual
