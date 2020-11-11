import pytest
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User, Group, Permission
from django.test import TestCase, Client
from pytest_lambda import lambda_fixture

pytestmark = pytest.mark.django_db

PERMISSIONS_ALL = Permission.objects.filter(content_type__app_label='api').all()


class TestGroupBasedAdmin(TestCase):
    # need to create new users, cannot use existing users. But use of existing usernames in DB not possible,
    # as it will throw an error. So DB is not being access but still somehow?
    def setUp(self):
        superuser_group, created = Group.objects.get_or_create(name='superuser')
        for permission in PERMISSIONS_ALL:
            superuser_group.permissions.add(permission)

        netadmin_group, created = Group.objects.get_or_create(name='netadmin')

        self.superuser, created = User.objects.get_or_create(username='test-superuser',
                                                             password=make_password('testing'))
        superuser_group.user_set.add(self.superuser)
        self.superuser.save()

        self.netadmin, created = User.objects.get_or_create(username='test-netadmin', password=make_password('testing'))
        netadmin_group.user_set.add(self.netadmin)
        self.netadmin.save()

        # create django super user (staff)
        self.django_staff, created = User.objects.get_or_create(username='staff', password=make_password('stafftest'),
                                                                is_staff=True, is_superuser=True)

    def test_superuser_permissions(self):
        client = Client()
        client.force_login(user=self.superuser)
        admin_pages = [
            "/admin/",
            "/admin/api/inventory/",
            "/admin/api/jobtemplate/",
            "/admin/api/task/",
        ]
        for page in admin_pages:
            resp = client.get(page)
            assert resp.status_code == 200

    def test_django_staff_permissions(self):
        client = Client()
        client.force_login(user=self.django_staff)
        admin_pages = [
            "/admin/",
            "/admin/api/inventory/",
            "/admin/api/jobtemplate/",
            "/admin/api/task/",
            "/admin/auth/group/",
            "/admin/auth/user/",
        ]
        for page in admin_pages:
            resp = client.get(page)
            assert resp.status_code == 200

    def test_user_not_allowed_access(self):
        client = Client()
        client.force_login(user=self.netadmin)
        admin_pages = [
            "/admin/",
        ]
        for page in admin_pages:
            resp = client.get(page)
            assert resp.status_code == 302
