import pytest
from django.test import TestCase
from mixer.backend.django import mixer

from api.models import Inventory

pytestmark = pytest.mark.django_db


class TestInventoryModel(TestCase):
    def test_add_inventory(self):
        mixer.blend(Inventory, name='Base')
        inventory_result = Inventory.objects.last()
        assert inventory_result.name == 'Base'
