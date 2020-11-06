from api.pagination import InventoryPagination
from rest_framework.response import Response


class MockRequest:
    GET = {}

    def __init__(self, limit=2, offset=1):
        self.GET = dict(limit=limit, offset=offset)


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
        self.request.GET = {}
        result = self.paginator.paginate_queryset(queryset=self.data, request=self.request)
        assert result == self.data
