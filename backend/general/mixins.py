from rest_framework import viewsets
from rest_framework.generics import get_object_or_404


class ObtenerPorMultiplesCamposMixin:

    multiple_lookup_fields = {}

    def get_object(self: viewsets.GenericViewSet):
        queryset = self.get_queryset()
        filter = {}
        for url, model_field in self.multiple_lookup_fields.items():
            filter[model_field] = self.kwargs[url]

        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj
