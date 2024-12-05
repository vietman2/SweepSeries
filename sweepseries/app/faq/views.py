from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .enums import FAQCategoryChoices
from .models import FAQ
from .serializers import FAQSerializer

class FaqViewSet(ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    http_method_names = ["get", "post", "put", "delete"]

    def get_permissions(self):
        any_actions = ['list', 'retrieve']
        if self.action in any_actions:
            return [AllowAny()]
        return [AdminOnly()]

    def list(self, request, *args, **kwargs):
        category_in_kor = request.query_params.get('category')
        category_mapping = {
            "예약": FAQCategoryChoices.RESERVATIONS,
            "이벤트": FAQCategoryChoices.EVENTS,
            "아카데미": FAQCategoryChoices.ACADEMY,
            "레슨": FAQCategoryChoices.LESSONS,
            "프로모드": FAQCategoryChoices.PROMODE,
            "기타": FAQCategoryChoices.OTHERS
        }

        user = request.user
        if user.is_superuser and is_admin_page(request):
            queryset = self.get_queryset()
        else:
            queryset = self.get_queryset().filter(is_active=True)

        if category_in_kor and category_in_kor != "전체":
            category_value = category_mapping.get(category_in_kor)
            if category_value is not None:
                queryset = queryset.filter(category=category_value)

            else:
                data = {"message": "Invalid category"}

                return Response(data, status=status.HTTP_400_BAD_REQUEST)

        serializer = FAQSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.updated_at = timezone.now()
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
