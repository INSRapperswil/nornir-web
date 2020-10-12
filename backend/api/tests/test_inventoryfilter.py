import pytest
from django.test import TestCase
from mixer.backend.django import mixer

from api.models import InventoryFilter

pytestmark = pytest.mark.django_db


class TestInventoryFilterModel(TestCase):
    def test_add_inventoryfilter(self):
        pass
