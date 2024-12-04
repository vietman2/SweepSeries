from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .enums import FAQCategoryChoices
from .models import FAQ
from .serializers import FAQSerializer

class FaqViewSet(ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    http_method_names = ["get"]

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

        if category_in_kor and category_in_kor != "전체":
            category_value = category_mapping.get(category_in_kor)
            if category_value is not None:
                self.queryset = self.queryset.filter(category=category_value)

            ## if category is not valid, return 400
            else:
                data = {"message": "Invalid category"}

                return Response(data, status=status.HTTP_400_BAD_REQUEST)

        return super().list(request, *args, **kwargs)
