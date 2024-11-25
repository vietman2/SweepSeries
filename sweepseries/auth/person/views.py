from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminOnly
from .models import Person
from .serializers import PersonSerializer

class PersonViewSet(ModelViewSet):
    serializer_class = PersonSerializer
    queryset = Person.objects.all()
    permission_classes = [AdminOnly]
    http_method_names = ['get']

    def list(self, request, *args, **kwargs):
        ## only return people with no user record
        q = Q()
        q &= Q(user=None)

        queryset = self.get_queryset().filter(q)

        serializer = self.get_serializer(queryset, many=True)        

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
