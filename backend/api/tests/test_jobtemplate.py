import pytest
from django.test import TestCase
from mixer.backend.django import mixer

from api.models import Inventory

pytestmark = pytest.mark.django_db


class TestJobtemplateModel(TestCase):
    def test_add_jobtemplate(self):
        pass
