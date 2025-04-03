from django.db.models import Q
from django.utils import timezone
from dj_rest_auth.views import LoginView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from core.utils import is_admin_page
from ..models import User
from ..serializers import UserAuthSerializer

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
    user_agent = request.headers.get('X-Sweep-Platform', '')

    if user_agent not in ['sweep/mobile']:
        ## remove refresh token
        response.data['refresh'] = ""

    return response
