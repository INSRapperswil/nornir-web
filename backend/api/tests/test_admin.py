import pytest
from django.test import TestCase

pytestmark = pytest.mark.django_db


# TODO: Get self.client.login to work, this ain't working...
class TestAdminPermissions(TestCase):

    def test_superuser_permissions(self):
        pass

    def test_django_staff_permissions(self):
        pass

    def test_user_not_allowed_access(self):
        pass
