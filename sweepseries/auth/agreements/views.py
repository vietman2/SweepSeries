from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.utils import is_admin_page
from .models import Agreement
from .serializers import AgreementSimpleSerializer, AgreementDetailSerializer

class AgreementViewSet(ModelViewSet):
    serializer_class = AgreementSimpleSerializer
    queryset = Agreement.objects.all()
    permission_classes = [AllowAny]
    http_method_names = ['get']

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        user = request.user
        if user.is_superuser and is_admin_page(request):
            serializer = AgreementDetailSerializer(queryset, many=True)
        else:
            serializer = AgreementSimpleSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)
