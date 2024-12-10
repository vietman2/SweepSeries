from django.db.models import Q
from django.utils import timezone
from dj_rest_auth.views import LoginView
from phonenumber_field.phonenumber import PhoneNumber
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from core.utils import is_admin_page
from auth.person.models import Person
from .models import User
from .serializers import UserSerializer, UserAuthSerializer, NaverRegisterSerializer

class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    http_method_names = ['get']

    def get_permissions(self):
        if self.action == 'me':
            return [IsAuthenticated()]

        return [AdminOnly()]

    def list(self, request, *args, **kwargs):
        #role = request.query_params.get('role', None)
        q = Q()
        q &= Q(is_superuser=False)

        queryset = self.get_queryset().filter(q)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="유저 정보 조회", tags=["유저"])
    @action(detail=False, methods=['get'])
    def me(self, request, *args, **kwargs):
        user = request.user
        serializer = UserAuthSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        if is_admin_page(request):
            q = Q()
            q &= Q(username=request.data['username'], is_superuser=True)
            if not User.objects.filter(q).exists():
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        response = super().post(request, *args, **kwargs)

        user = User.objects.get(username=request.data['username'])
        user.last_login = timezone.now()
        user.save()

        return process_response(request, response)

class KakaoLoginView(APIView):
    def post(self, request, *args, **kwargs): ## pylint: disable=unused-argument
        ## 이미 계정이 있으면 로그인
        ## 없으면 계정 생성 후 로그인

        return Response({'error': 'Not implemented'}, status=status.HTTP_501_NOT_IMPLEMENTED)

class NaverLoginView(APIView):
    def post(self, request, *args, **kwargs): ## pylint: disable=unused-argument
        number = PhoneNumber.from_string(request.data['phone_number'])
        person = Person.objects.filter(phone_number=number).first()

        if person is None:
            serializer = NaverRegisterSerializer(data=request.data)

            try:
                serializer.is_valid(raise_exception=True)
                user = serializer.create_user_and_person(serializer.validated_data)
                person = user.person
            except ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(person=person).first()

        if user is None:
            serializer = NaverRegisterSerializer(data=request.data)

            try:
                serializer.is_valid(raise_exception=True)
                person = serializer.update_person(person, serializer.validated_data)
                user = serializer.create_user(serializer.validated_data, person)
            except ValidationError as e:
                return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        data = get_tokens_for_user(user)
        user_serializer = UserAuthSerializer(user)

        data['user'] = user_serializer.data
        return Response(data, status=status.HTTP_200_OK)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'refresh_expiration': refresh.get('exp'),
        'access': str(refresh.access_token),
        'access_expiration': refresh.access_token.get('exp'),
    }

def process_response(request, response):
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

    if 'sweep' not in user_agent:
        ## remove refresh token
        response.data['refresh'] = ""

    return response
