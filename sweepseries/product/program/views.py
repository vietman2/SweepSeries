from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from auth.userprofile.models import UserProfile
from product.academy.models import Academy
from product.coach.enums import CoachApplicationStatus
from product.coach.models import Coach
from product.coach.serializers import CoachSimpleSerializer
from .models import Program, Target, Position, CoachTeam
from .serializers import (
    ProgramSerializer, TargetSerializer, PositionSerializer, CoachTeamSerializer
)
from .utils import update_curriculums

class ProgramViewSet(ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

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

    @extend_schema(summary="프로그램 상세 조회", tags=["프로그램"])
    def retrieve(self, request, *args, **kwargs):
        program = self.get_object()
        targets = Target.objects.all()
        positions = Position.objects.all()

        q = Q(academy__uuid=program.academy.uuid)

        q &= Q(is_verified=True, status=CoachApplicationStatus.APPROVED)
        coaches = Coach.objects.filter(q)
        serializer = CoachSimpleSerializer(coaches, many=True)
        serializer.context['request'] = request

        program_data = ProgramSerializer(program).data
        targets_data = TargetSerializer(targets, many=True).data
        positions_data = PositionSerializer(positions, many=True).data
        coaches_data = serializer.data

        return Response(
            data={
                "program": program_data,
                "targets": targets_data,
                "positions": positions_data,
                "coaches": coaches_data
            },
            status=status.HTTP_200_OK
        )

    @extend_schema(summary="프로그램 생성", tags=["프로그램"])
    def create(self, request, *args, **kwargs):
        serializer = ProgramSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "프로그램이 생성되었습니다."}, status=status.HTTP_201_CREATED)

    @extend_schema(summary="프로그램 수정", tags=["프로그램"])
    def partial_update(self, request, *args, **kwargs):
        program = self.get_object()
        serializer = ProgramSerializer(program, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "프로그램이 수정되었습니다."}, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 삭제", tags=["프로그램"])
    def destroy(self, request, *args, **kwargs):
        program = self.get_object()
        program.delete()

        return Response({"message": "프로그램이 삭제되었습니다."}, status=status.HTTP_200_OK)

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

    @extend_schema(summary="프로그램 커리큘럼 수정", tags=["프로그램"])
    @action(detail=True, methods=['patch'])
    def curriculums(self, request, *args, **kwargs):
        program = self.get_object()
        curriculums = request.data.get("curriculums")

        if curriculums is None:
            return Response({"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

        program = update_curriculums(program, curriculums)

        return Response({"message": "프로그램 커리큘럼이 수정되었습니다."}, status=status.HTTP_200_OK)

    @extend_schema(summary="프로그램 코치 임의 배정 토글", tags=["프로그램"])
    @action(detail=True, methods=['patch'])
    def toggle(self, request, *args, **kwargs):
        program = self.get_object()
        program.select_disabled = not program.select_disabled
        program.save()

        return Response({"message": "프로그램 코치 임의 배정이 수정되었습니다."}, status=status.HTTP_200_OK)

class CoachTeamViewSet(ModelViewSet):
    queryset = CoachTeam.objects.all()
    serializer_class = CoachTeamSerializer
    http_method_names = ['post', 'delete']

    @extend_schema(summary="프로그램 코치팀 추가", tags=["프로그램"])
    def create(self, request, *args, **kwargs):
        program_id = kwargs['program_id']
        serializer = CoachTeamSerializer(data=request.data)
        program = Program.objects.filter(id=program_id).first()

        if program is None:
            return Response({"message": "프로그램이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        serializer.context['program'] = program

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "프로그램 코치팀이 추가되었습니다."}, status=status.HTTP_201_CREATED)

    @extend_schema(summary="프로그램 코치팀 삭제", tags=["프로그램"])
    def destroy(self, request, *args, **kwargs):
        program_id = kwargs['program_id']
        team_id = kwargs['pk']
        program = Program.objects.filter(id=program_id).first()
        team = CoachTeam.objects.filter(id=team_id).first()

        if program is None or team is None:
            return Response({"message": "프로그램 또는 코치팀이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        program.teams.remove(team)

        return Response({"message": "프로그램 코치팀이 삭제되었습니다."}, status=status.HTTP_200_OK)
