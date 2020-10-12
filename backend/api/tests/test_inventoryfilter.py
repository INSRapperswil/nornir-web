import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase
from mixer.backend.django import mixer
from pytest_drf import APIViewTest, UsesGetMethod, Returns200, AsUser
from pytest_lambda import lambda_fixture

from api.models import InventoryFilter

from api.tests.expected_data import *

pytestmark = pytest.mark.django_db

user = lambda_fixture(
    lambda: User.objects.get(username='thomastest')
)


class TestInventoryFilterModel(TestCase):
    def test_add_inventoryfilter(self):
        mixer.blend(InventoryFilter, filter='blah')
        inventoryfilter = InventoryFilter.objects.last()
        assert inventoryfilter.filter == 'blah'


class TestInventoryFilterApi(APIViewTest, UsesGetMethod, Returns200, AsUser('user')):
    url = lambda_fixture(lambda: reverse('inventoryfilter-list'))

    def test_inventoryfilter_list(self, json):
        actual = json
        assert expected_inventoryfilter_list == actual
