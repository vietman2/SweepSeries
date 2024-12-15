from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from product.academy.models import Academy
from .models import Program, Target, Position
from .serializers import ProgramSerializer, TargetSerializer, PositionSerializer

class ProgramViewSet(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    http_method_names = ['get', 'post']

    @extend_schema(summary="프로그램 대상 목록 조회", tags=["프로그램"])
    @action(detail=False, methods=['get'])
    def targets(self, request):
        targets = Target.objects.all()
        serializer = TargetSerializer(targets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 포지션 목록 조회", tags=["프로그램"])
    @action(detail=False, methods=['get'])
    def positions(self, request):
        positions = Position.objects.all()
        serializer = PositionSerializer(positions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 생성", tags=["프로그램"])
    def create(self, request):
        serializer = ProgramSerializer(data=request.data)
        academy_id = request.data.get("academy")
        target_id = request.data.get("target")
        position_ids = request.data.get("positions")

        if academy_id is None or target_id is None or position_ids is None:
            return Response({"academy": ["필수 항목입니다."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            academy = Academy.objects.filter(uuid=academy_id).first()
            target = Target.objects.get(id=target_id)
            positions = Position.objects.filter(id__in=position_ids)
            serializer.is_valid(raise_exception=True)
            serializer.save(academy=academy, target=target, positions=positions)
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "프로그램이 생성되었습니다."}, status=status.HTTP_201_CREATED)

    @extend_schema(summary="프로그램 목록 조회", tags=["프로그램"])
    def list(self, request):
        academy_id = request.query_params.get("academy")

        if academy_id is None:
            return Response({"academy": ["필수 항목입니다."]}, status=status.HTTP_400_BAD_REQUEST)

        programs = Program.objects.filter(academy__uuid=academy_id)
        serializer = ProgramSerializer(programs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
