from rest_framework.response import Response

from api.inventory_helpers import InventoryOrdering, InventoryPagination


class MockRequest:
    query_params = {}

    def __init__(self, limit=2, offset=1, ordering=''):
        self.query_params = dict(limit=limit, offset=offset, ordering=ordering)


class MockView:
    ordering_fields = ['key']

    def __init__(self, ordering_fields=['key']):
        self.ordering_fields = ordering_fields


class TestInventoryPagination:
    def setup_method(self):
        self.paginator = InventoryPagination()
        self.data = [1, 2, 3, 4, 5]
        self.request = MockRequest()

    def test_get_paginated_response(self):
        response = self.paginator.get_paginated_response(self.data)
        assert type(response) == Response
        assert response.status_code == 200
        assert response.data['count'] == 0
        assert response.data['results'] == self.data

    def test_paginate_queryset(self):
        result = self.paginator.paginate_queryset(queryset=self.data, request=self.request)
        assert self.paginator.count == 5
        assert result == [2, 3]

    def test_paginate_queryset_with_no_params(self):
        self.request.query_params = {}
        result = self.paginator.paginate_queryset(queryset=self.data, request=self.request)
        assert result == self.data


class TestInventoryOrdering:
    def setup_method(self):
        self.object = InventoryOrdering()
        self.queryset = [
            {'key': 'betha'},
            {'key': 'alpha'},
            {'key': 'gamma'},
        ]

    def test_ordering_asc(self):
        actual = self.object.filter_queryset(MockRequest(2, 1, 'key'), self.queryset, MockView())
        sorted = [
            {'key': 'alpha'},
            {'key': 'betha'},
            {'key': 'gamma'},
        ]
        assert sorted == actual

    def test_ordering_desc(self):
        actual = self.object.filter_queryset(MockRequest(10, 0, '-key'), self.queryset, MockView())
        sorted = [
            {'key': 'gamma'},
            {'key': 'betha'},
            {'key': 'alpha'},
        ]
        assert sorted == actual

    def test_key_not_registered(self):
        expected = self.queryset.copy()
        actual = self.object.filter_queryset(MockRequest(10, 0, 'key'), self.queryset, MockView(ordering_fields=[]))
        assert actual == expected

    def test_ordering_without_key(self):
        expected = self.queryset.copy()
        actual = self.object.filter_queryset(MockRequest(10, 0, ''), self.queryset, MockView())
        assert actual == expected
