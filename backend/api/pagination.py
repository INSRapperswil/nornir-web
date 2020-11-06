from rest_framework import pagination
from django.conf import settings
from rest_framework.response import Response

class InventoryPagination(pagination.BasePagination):
    def __init__(self):
        self.count = 0

    def get_paginated_response(self, data):
        return Response({
            'count': self.count,
            'results': data,
        })

    def paginate_queryset(self, queryset, request, view=None):
        limit = int(request.GET['limit']) if 'limit' in request.GET else settings.REST_FRAMEWORK.get('PAGE_SIZE')
        offset = int(request.GET['offset']) if 'offset' in request.GET else 0
        self.count = len(queryset)
        data = queryset[offset:(offset + limit)]
        return data
