from operator import itemgetter

from django.conf import settings
from rest_framework import pagination
from rest_framework.filters import BaseFilterBackend
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
        limit = int(request.query_params['limit']) if 'limit' in request.query_params else settings.REST_FRAMEWORK.get(
            'PAGE_SIZE')
        offset = int(request.query_params['offset']) if 'offset' in request.query_params else 0
        self.count = len(queryset)
        data = queryset[offset:(offset + limit)]
        return data


class InventoryOrdering(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        if 'ordering' in request.query_params:
            ordering = request.query_params['ordering']
            if ordering in view.ordering_fields:
                return sorted(queryset, key=itemgetter(ordering))
            elif ordering[1:] in view.ordering_fields:
                return sorted(queryset, key=itemgetter(ordering[1:]), reverse=True)
            else:
                return queryset
        else:
            return queryset
