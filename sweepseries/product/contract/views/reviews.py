from django.db.models import F, Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from product.lesson.serializers import SessionSerializer
from ..models import Contract, Review, LessonReviewTags, CoachReviewTags, AcademyReviewTags
from ..serializers import (
    ReviewSerializer, LessonReviewTagSerializer,
    CoachReviewTagSerializer, AcademyReviewTagSerializer,
)

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    @extend_schema(summary="리뷰 목록 조회", tags=["리뷰"])
    def list(self, request, *args, **kwargs):
        user = request.user
        q = Q(contract__customer=user.person)

        reviews = Review.objects.filter(q)
        serializer = ReviewSerializer(reviews, many=True)

        ## 완료가 되었으나, 리뷰가 없는 경우를 필터해서 반환.
        contracts_q = (
            Q(customer=user.person) &
            Q(review__isnull=True) &
            Q(completed_lessons=F('curriculum__num_lessons'))
        )
        contracts = Contract.objects.filter(contracts_q)
        ## contracts가 있다면, 가장 마지막에 진행한 세션을 반환

        sessions = []

        for contract in contracts:
            session = contract.sessions.order_by('-start_datetime').first()
            if session is not None:
                sessions.append(session)
            else:
                ## Should not reach here
                return Response(data={"error": "오류가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)

        session_serializer = SessionSerializer(sessions, many=True)
        session_serializer.context['do_encoding'] = True
        return Response(
            data={"sessions": session_serializer.data, "reviews": serializer.data},
            status=status.HTTP_200_OK
        )

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="리뷰 작성", tags=["리뷰"])
    def create(self, request, *args, **kwargs):
        user = request.user

        data = request.data.copy()
        data.setlist('lesson_images', request.FILES.getlist('lesson_images', []))
        data.setlist('coach_images', request.FILES.getlist('coach_images', []))
        data.setlist('academy_images', request.FILES.getlist('academy_images', []))
        serializer = ReviewSerializer(data=data)
        serializer.context['user'] = user

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(data={"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "리뷰가 성공적으로 작성되었습니다."}, status=status.HTTP_201_CREATED)

    @extend_schema(summary="리뷰 목록 조회", tags=["리뷰"])
    @action(detail=False, methods=['get'])
    def tags(self, request, *args, **kwargs):
        lesson_positives = LessonReviewTags.objects.filter(is_positive=True)
        lesson_negatives = LessonReviewTags.objects.filter(is_positive=False)

        coach_positives = CoachReviewTags.objects.filter(is_positive=True)
        coach_negatives = CoachReviewTags.objects.filter(is_positive=False)

        academy_positives = AcademyReviewTags.objects.filter(is_positive=True)
        academy_negatives = AcademyReviewTags.objects.filter(is_positive=False)

        return Response(
            data={
                "lesson": {
                    "positives": LessonReviewTagSerializer(lesson_positives, many=True).data,
                    "negatives": LessonReviewTagSerializer(lesson_negatives, many=True).data
                },
                "coach": {
                    "positives": CoachReviewTagSerializer(coach_positives, many=True).data,
                    "negatives": CoachReviewTagSerializer(coach_negatives, many=True).data
                },
                "academy": {
                    "positives": AcademyReviewTagSerializer(academy_positives, many=True).data,
                    "negatives": AcademyReviewTagSerializer(academy_negatives, many=True).data
                }
            },
            status=status.HTTP_200_OK
        )
