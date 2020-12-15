import pytest
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from mixer.backend.django import mixer
from pytest_drf import APIViewTest, UsesGetMethod, Returns200, AsUser
from pytest_lambda import lambda_fixture

from api.models import Inventory
from api.tests.expected_data import *

pytestmark = pytest.mark.django_db

user = lambda_fixture(
    lambda: User.objects.get(username='thomastest')
)


class TestInventoryModel(TestCase):
    def test_add_inventory(self):
        mixer.blend(Inventory, name='Base')
        inventory_result = Inventory.objects.last()
        assert inventory_result.name == 'Base'


class TestInventoryApi(APIViewTest, UsesGetMethod, Returns200, AsUser('user')):
    url = lambda_fixture(lambda: reverse('inventory-list'))

    def test_inventory_list(self, json):
        actual = json
        assert expected_inventory_list == actual
