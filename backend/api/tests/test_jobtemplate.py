import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase
from mixer.backend.django import mixer
from pytest_drf import APIViewTest, UsesGetMethod, Returns200, AsUser
from pytest_lambda import lambda_fixture

from api.models import JobTemplate

from api.tests.expected_data import *

pytestmark = pytest.mark.django_db

user = lambda_fixture(
    lambda: User.objects.get(username='thomastest')
)


class TestJobtemplateModel(TestCase):
    def test_add_jobtemplate(self):
        mixer.blend(JobTemplate, name='Update Cisco', description='Updates Firmware on Cisco devices',
                    file_name='update.py', created_by=User.objects.first())
        job = JobTemplate.objects.last()
        assert job.name == 'Update Cisco'
        assert job.description == 'Updates Firmware on Cisco devices'
        assert job.created_by.username == 'thomastest'


class TestJobTemplateApi(APIViewTest, UsesGetMethod, Returns200, AsUser('user')):
    url = lambda_fixture(lambda: reverse('jobtemplate-list'))

    def test_jobtemplate_list(self, json):
        actual = json
        assert expected_jobtemplate_list == actual
