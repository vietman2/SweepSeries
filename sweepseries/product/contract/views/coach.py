from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from product.coach.models import Coach
from product.lesson.models import Session
from ..models import Review
from ..serializers import CoachReviewSerializer

class CoachReviewPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return {
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        }

class CoachReviewViewSet(ModelViewSet):
    """
        코치 리뷰 API
        주소는 /v1/coaches/{coach_id}/reviews/
    """
    serializer_class = CoachReviewSerializer
    queryset = Review.objects.all()
    pagination_class = CoachReviewPageNumberPagination
    http_method_names = ['get']

    @extend_schema(summary="코치 리뷰 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        coach_id = self.kwargs.get('coach_id')
        coach = Coach.objects.filter(uuid=coach_id).first()

        if coach is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "코치를 찾을 수 없습니다."}
            )

        sessions = Session.objects.filter(coaches=coach)
        contracts = sessions.values_list('contract', flat=True).distinct()
        reviews = Review.objects.filter(contract__in=contracts)

        page = self.paginate_queryset(reviews)

        serializer = CoachReviewSerializer(page, many=True)
        data = self.get_paginated_response(serializer.data)

        data["summary"] = {
            "average_rating": coach.cached_rating,
            "summary": {
                "rating_5": reviews.filter(coach_rating=5).count(),
                "rating_4": reviews.filter(coach_rating=4).count(),
                "rating_3": reviews.filter(coach_rating=3).count(),
                "rating_2": reviews.filter(coach_rating=2).count(),
                "rating_1": reviews.filter(coach_rating=1).count(),
                "total": reviews.count()
            }
        }

        return Response(data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
            data={"error": "잘못된 요청입니다."}
        )
