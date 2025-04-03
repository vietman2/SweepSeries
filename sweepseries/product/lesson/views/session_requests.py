from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.db.transaction import atomic
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from product.academy.models import Academy
from product.academy.permissions import IsAcademyStaff
from ..models import SessionRequest
from ..serializers import SessionRequestSerializer
from ..utils import accept_requests

class SessionRequestViewSet(ModelViewSet):
    queryset = SessionRequest.objects.all()
    serializer_class = SessionRequestSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch']

    @extend_schema(summary="레슨 요청 생성", tags=["레슨"])
    def create(self, request, *args, **kwargs):
        serializer = SessionRequestSerializer(data=request.data)
        serializer.context['user'] = request.user

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨 요청이 성공적으로 생성되었습니다."},
            status=status.HTTP_201_CREATED
        )

    @extend_schema(summary="레슨 요청 조회", tags=["레슨"])
    def list(self, request, *args, **kwargs):
        academy_id = request.query_params.get('academy', None)

        try:
            academy = Academy.objects.get(uuid=academy_id)
        except ObjectDoesNotExist:
            return Response(
                data={"message": "아카데미가 존재하지 않습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ## check if the user is a staff of the academy
        if not IsAcademyStaff().has_object_permission(request, self, academy):
            return Response(
                data={"message": "권한이 없습니다."},
                status=status.HTTP_403_FORBIDDEN
            )

        q = Q(program__academy=academy)
        q &= Q(rejected=False)
        q &= Q(accepted=False)
        session_requests = SessionRequest.objects.filter(q)

        serializer = SessionRequestSerializer(session_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(exclude=True)
    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="레슨 요청 승인", tags=["레슨"])
    @action(detail=False, methods=['patch'])
    def accept(self, request):
        request_ids = request.data.get('requests', None)
        academy_id = request.data.get('academy', None)

        if request_ids is None or academy_id is None:
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            academy = Academy.objects.get(uuid=academy_id)
        except ObjectDoesNotExist:
            return Response(
                data={"message": "아카데미가 존재하지 않습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ## check if the user is a staff of the academy
        if not IsAcademyStaff().has_object_permission(request, self, academy):
            return Response(
                data={"message": "권한이 없습니다."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            accept_requests(request_ids)
        except ValidationError as e:
            return Response(
                data={"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            data={"message": "레슨 요청이 성공적으로 승인되었습니다."},
            status=status.HTTP_200_OK
        )

    @extend_schema(summary="레슨 요청 거절", tags=["레슨"])
    @action(detail=False, methods=['patch'])
    def reject(self, request):
        request_ids = request.data.get('requests', None)
        academy_id = request.data.get('academy', None)

        if request_ids is None or academy_id is None:
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            academy = Academy.objects.get(uuid=academy_id)
        except ObjectDoesNotExist:
            return Response(
                data={"message": "아카데미가 존재하지 않습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ## check if the user is a staff of the academy
        if not IsAcademyStaff().has_object_permission(request, self, academy):
            return Response(
                data={"message": "권한이 없습니다."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            with atomic():
                for request_id in request_ids:
                    session_request = SessionRequest.objects.get(id=request_id)
                    session_request.rejected = True
                    session_request.save()
        except ObjectDoesNotExist:
            return Response(
                data={"message": "레슨 요청이 존재하지 않습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            data={"message": "레슨 요청이 성공적으로 거절되었습니다."},
            status=status.HTTP_200_OK
        )
