from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from product.academy.models import Academy
from ..models import Review
from ..serializers import AcademyReviewSerializer, AcademyReviewSummarySerializer

class AcademyReviewPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class AcademyReviewViewSet(ModelViewSet):
    """
        아카데미 리뷰 API
        주소는 /v1/academies/{academy_id}/reviews/
    """
    serializer_class = AcademyReviewSerializer
    queryset = Review.objects.all()
    pagination_class = AcademyReviewPageNumberPagination
    http_method_names = ['get']

    @extend_schema(summary="아카데미 리뷰 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        academy_id = self.kwargs.get('academy_id')
        academy = Academy.objects.filter(uuid=academy_id).first()

        if academy is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "아카데미를 찾을 수 없습니다."}
            )

        q = Q(contract__curriculum__program__academy=academy)
        q &= Q(secure_academy=False)

        reviews = Review.objects.filter(q)

        page = self.paginate_queryset(reviews)

        serializer = AcademyReviewSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
            data={"error": "잘못된 요청입니다."}
        )

    @extend_schema(summary="아카데미 평점 요약 조회", tags=["아카데미"])
    @action(detail=False, methods=['get'])
    def summary(self, request, *args, **kwargs):     # pylint: disable=unused-argument
        academy_id = self.kwargs.get('academy_id')
        academy = Academy.objects.filter(uuid=academy_id).first()

        if academy is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "아카데미를 찾을 수 없습니다."}
            )

        serializer = AcademyReviewSummarySerializer(academy)

        return Response(serializer.data, status=status.HTTP_200_OK)
