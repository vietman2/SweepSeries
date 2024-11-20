from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .validators import EmailValidator, UsernameValidator
#from .serializers import CatchBRegisterSerializer
#from .utils import get_register_error_message

class CheckUsernameEmailView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['get', 'head', 'options']

    @extend_schema(summary="아이디/이메일 중복 확인", tags=["회원 관리"])
    def get(self, request, *args, **kwargs):
        # pylint: disable=unused-argument
        username = request.query_params.get('username', None)
        email = request.query_params.get('email', None)

        try:
            username_validator = UsernameValidator()
            email_validator = EmailValidator()

            username_validator(username)
            email_validator(email)
        except ValidationError as e:
            return Response(data={
                "message": e.detail[0],
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "사용 가능한 아이디와 이메일입니다."}, status=status.HTTP_200_OK)

class CheckPasswordView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['post', 'head', 'options']

    @extend_schema(summary="비밀번호 확인", tags=["회원 관리"])
    def post(self, request):
        password = request.data.get('password', None)
        password2 = request.data.get('password2', None)
        if not password or not password2:
            return Response(data={
                "message": "비밀번호를 입력해주세요.",
            }, status=status.HTTP_400_BAD_REQUEST)
        if password != password2:
            return Response(data={
                "message": "비밀번호가 일치하지 않습니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except DjangoValidationError as e:
            return Response(data={
                "message": e.messages[0],
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "사용 가능한 비밀번호입니다."}, status=status.HTTP_200_OK)
