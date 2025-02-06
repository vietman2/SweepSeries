from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from auth.userprofile.models import UserProfile
from product.academy.models import Academy
from product.coach.models import Coach
from .models import Program, Target, Position
from .serializers import ProgramSerializer, TargetSerializer, PositionSerializer

class ProgramViewSet(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    http_method_names = ['get', 'post']

    @extend_schema(summary="프로그램 대상 목록 조회", tags=["프로그램"])
    @action(detail=False, methods=['get'])
    def targets(self, request):         ## pylint: disable=unused-argument
        targets = Target.objects.all()
        serializer = TargetSerializer(targets, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 포지션 목록 조회", tags=["프로그램"])
    @action(detail=False, methods=['get'])
    def positions(self, request):       ## pylint: disable=unused-argument
        positions = Position.objects.all()
        serializer = PositionSerializer(positions, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 생성", tags=["프로그램"])
    def create(self, request, *args, **kwargs):
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
    def list(self, request, *args, **kwargs):
        academy_id = request.query_params.get("academy")
        profile_id = request.query_params.get("profile")

        if academy_id is not None:
            programs = Program.objects.filter(academy__uuid=academy_id)
            serializer = ProgramSerializer(programs, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        if profile_id is not None:
            ## 1. 프로필의 회원이 아카데미를 소유중이면, 해당 아카데미의 프로그램을 조회
            ## 2. 프로필의 회원이 코치면, 해당 아카데미의 프로그램을 조회
            ## profile = get by id or 404
            profile = UserProfile.objects.filter(id=profile_id).first()

            if profile is None:
                return Response({"message": "프로필이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

            user = profile.user
            academy = Academy.objects.filter(owner=user).first()

            if academy is not None:
                programs = Program.objects.filter(academy=academy)
                serializer = ProgramSerializer(programs, many=True)

                return Response(serializer.data, status=status.HTTP_200_OK)

            coach = Coach.objects.filter(person=user.person).first()

            if coach is not None:
                programs = Program.objects.filter(academy=coach.academy)
                serializer = ProgramSerializer(programs, many=True)

                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)
