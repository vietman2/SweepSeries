from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from product.coach.models import Coach
from ..models import Academy, AcademyStudent
from ..serializers import AcademySimpleSerializer

class MyAcademiesView(GenericAPIView):
    """
        내 아카데미 조회: url은 /api/v1/academies/my/
            - 일반모드: 학생으로서 소속된 아카데미 조회
            - 프로모드:
                - 소속된 아카데미 전부 조회 (코치 / 사장 전부 함께 조회)
    """
    permission_classes=[IsAuthenticated,]
    http_method_names = ['get']

    @extend_schema(summary="내 아카데미 조회", tags=["아카데미"])
    @action(detail=False, methods=['get'])
    def get(self, request):
        user = request.user
        mode = request.query_params.get('mode', 'owner')

        if mode == 'student':
            student_profiles = AcademyStudent.objects.filter(person=user.person)
            academies = [student.academy for student in student_profiles]
        elif mode == 'coach':
            coach_profiles = Coach.objects.filter(person=user.person)
            academies = [coach.academy for coach in coach_profiles]
        else:
            academies = Academy.objects.filter(owner=user)

            if not academies.exists():
                return Response(
                    status=status.HTTP_404_NOT_FOUND,
                    data={"error": "아카데미 정보가 없습니다."}
                )

        serializer = AcademySimpleSerializer(academies, many=True)
        serializer.context['user'] = user
        serializer.context['mode'] = mode

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )
