from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from product.contract.models import Contract
from product.contract.serializers import ContractSerializer
from ..models import Lesson
from ..serializers import LessonSerializer

class LessonViewSet(ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'get']

    @extend_schema(summary="레슨 생성", tags=["레슨"])
    def create(self, request, *args, **kwargs):
        serializer = LessonSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨이 성공적으로 생성되었습니다."},
            status=status.HTTP_201_CREATED
        )

    @extend_schema(summary="레슨 검색", tags=["레슨"])
    def list(self, request, *args, **kwargs):
        ## 레슨 임의 추가 시, 잔여 계약이 있는지 확인하기 위한 API
        ## query로 들어온 program과 student로 lesson이 있는지 검색.
        ## 있다면, Contract에 남아있는 레슨 횟수가 있는지도 확인하여 반환한다.
        program = request.query_params.get('program', None)
        student = request.query_params.get('student', None)

        try:
            Lesson.objects.get(program=program, student=student)
        except ObjectDoesNotExist:
            return Response(
                data={"remaining_lessons": -1},
                status=status.HTTP_200_OK
            )

        q = Q(customer=student)
        q &= Q(curriculum__program=program)

        contract = Contract.objects.filter(q).first()

        if contract is None:
            ## This should not happen.
            return Response(
                data={"message": "오류가 발생했습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            data=ContractSerializer(contract).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
