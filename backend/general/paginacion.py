from django.utils.translation import gettext_lazy as _
from rest_framework import pagination
from rest_framework.response import Response


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size_query_param = "limit"
    page_query_description = _(
        "Número de página dentro del conjunto de resultados paginados."
    )
    page_size_query_description = _("Cantidad de resultados por página")

    def paginate_queryset(self, queryset, request, view=None):
        page_query_param = request.query_params.get(self.page_query_param)

        if not page_query_param:
            # If page query param not provided skip pagination
            return None

        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        current_page = self.page.number
        next_page = self.page.next_page_number() if self.get_next_link() else None
        previous_page = (
            self.page.previous_page_number() if self.get_previous_link() else None
        )

        return Response(
            {
                "meta": {
                    "itemCount": self.page.paginator.count,
                    "pageCount": self.page.paginator.num_pages,
                    "currentPage": current_page,
                    "next": self.get_next_link(),
                    "nextPage": next_page,
                    "previous": self.get_previous_link(),
                    "previousPage": previous_page,
                },
                "data": data,
            }
        )

    def get_paginated_response_schema(self, schema):
        return {
            "type": "object",
            "required": ["count", "results"],
            "properties": {
                "meta": {
                    "type": "object",
                    "properties": {
                        "itemCount": {
                            "type": "integer",
                            "required": "true",
                        },
                        "pageCount": {
                            "type": "integer",
                            "required": "true",
                        },
                        "currentPage": {
                            "type": "integer",
                            "required": "true",
                        },
                        "next": {
                            "type": "string",
                            "nullable": True,
                            "format": "uri",
                            "example": "http://api.example.org/accounts/?{page_query_param}=2".format(
                                page_query_param=self.page_query_param
                            ),
                        },
                        "nextPage": {
                            "type": "integer",
                            "nullable": True,
                        },
                        "previous": {
                            "type": "string",
                            "nullable": True,
                            "format": "uri",
                            "example": "http://api.example.org/accounts/?{page_query_param}=2".format(
                                page_query_param=self.page_query_param
                            ),
                        },
                        "previousPage": {
                            "type": "integer",
                            "nullable": True,
                        },
                    },
                },
                "data": schema,
            },
        }
