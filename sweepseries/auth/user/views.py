from django.db.models import Q
from django.utils import timezone
from dj_rest_auth.views import LoginView
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .models import User
from .serializers import UserSerializer, UserAuthSerializer

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
    def me(self, request, *args, **kwargs): ## pylint: disable=unused-argument
        full = request.query_params.get('full', False)
        profile_id = request.query_params.get('profile_id', None)

        user = request.user
        if full:
            serializer = UserSerializer(user)
            serializer.context['profile_id'] = profile_id
        else:
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

class SocialLoginView(APIView):
    def post(self, request, *args, **kwargs): ## pylint: disable=unused-argument
        username = request.data.get('username', None)

        if username is None or username == '':
            return Response(data={'error': '잘못된 요청입니다.',} ,status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(username=username).first()

        if user is None:
            return Response(data={'result': 'not_registered',} ,status=status.HTTP_200_OK)

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
        'result': 'success',
    }

def process_response(request, response):
    user_agent = request.META.get('HTTP_USER_AGENT', '').lower()

    if 'sweep' not in user_agent:
        ## remove refresh token
        response.data['refresh'] = ""

    return response
