from django.urls import reverse, resolve


class TestUrls:

    def test_configuration_url(self):
        path = reverse('configuration-list')
        assert resolve(path).view_name == 'configuration-list'
        assert path == '/api/configuration/'

    def test_inventory_list_url(self):
        path = reverse('inventory-list')
        assert resolve(path).view_name == 'inventory-list'
        assert path == '/api/inventories/'

    def test_task_list_url(self):
        path = reverse('task-list')
        assert resolve(path).view_name == 'task-list'
        assert path == '/api/tasks/'

    def test_jobtemplate_list_url(self):
        path = reverse('jobtemplate-list')
        assert resolve(path).view_name == 'jobtemplate-list'
        assert path == '/api/templates/'

    def test_user_list_url(self):
        path = reverse('user-list')
        assert resolve(path).view_name == 'user-list'
        assert path == '/api/users/'
