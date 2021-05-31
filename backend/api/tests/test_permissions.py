import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from pytest_drf import APIViewTest, AsUser, Returns200, Returns401, Returns403, UsesGetMethod, UsesPostMethod
from pytest_lambda import lambda_fixture, static_fixture

pytestmark = pytest.mark.django_db

superuser = lambda_fixture(lambda: User.objects.get(username='thomastest'))
netadmin = lambda_fixture(lambda: User.objects.get(username='norbert'))

expected_configuration = {'logging': {'enabled': True,
                                      'format': '%(asctime)s - %(name)12s - %(levelname)8s - '
                                                '%(funcName)10s() - %(message)s',
                                      'level': 'INFO',
                                      'log_file': 'nornir.log'},
                          'runner': {'options': {'num_workers': 200},
                                     'plugin': 'threaded'}, }


class TestGetConfigurationPermissionAsSuperuser(APIViewTest, UsesGetMethod, Returns200, AsUser('superuser')):
    url = lambda_fixture(lambda: reverse('configuration-list'))

    def test_configuration_list(self, json):
        actual = json
        assert expected_configuration == actual


class TestPostConfigurationPermissionAsSuperuser(APIViewTest, UsesPostMethod, Returns200, AsUser('superuser')):
    url = lambda_fixture(lambda: reverse('configuration-list'))
    data = static_fixture(expected_configuration)

    def test_configuration_post(self, json):
        actual = json
        assert expected_configuration == actual


class TestGetConfigurationPermissionAsNetadmin(APIViewTest, UsesGetMethod, Returns200, AsUser('netadmin')):
    url = lambda_fixture(lambda: reverse('configuration-list'))

    def test_configuration_list(self, json):
        actual = json
        assert expected_configuration == actual


class TestPostConfigurationPermissionAsNetadmin(APIViewTest, UsesPostMethod, Returns403, AsUser('netadmin')):
    format = 'json'
    url = lambda_fixture(lambda: reverse('configuration-list'))
    data = static_fixture(expected_configuration)

    def test_configuration_post(self, json):
        actual = json
        assert {'detail': 'You do not have permission to perform this action.'} == actual


class TestGetConfigurationPermissionNotAuthenticated(APIViewTest, UsesGetMethod, Returns401):
    url = lambda_fixture(lambda: reverse('configuration-list'))

    def test_configuration_list(self, json):
        actual = json
        assert {'detail': 'Authentication credentials were not provided.'} == actual
