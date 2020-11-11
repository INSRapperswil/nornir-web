import pytest
from django.contrib.auth.models import User
from django.test import TestCase, Client
from pytest_lambda import lambda_fixture

pytestmark = pytest.mark.django_db

superuser = lambda_fixture(lambda: User.objects.get(username='thomastest'))


# TODO: Get self.client.login to work, this ain't working...
class TestAdminPermissions(TestCase):
    def test_superuser_permissions(self):
        self.user = superuser
        client = Client()
        client.force_login(user=self.user)
        admin_pages = [
            "/admin/",
            # put all the admin pages for your models in here.
            "/admin/api/tasks/",
        ]
        for page in admin_pages:
            resp = client.get(page)
            assert resp.status_code == 200

    def test_django_staff_permissions(self):
        pass

    def test_user_not_allowed_access(self):
        pass
