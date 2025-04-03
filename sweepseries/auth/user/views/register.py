from django.contrib.auth.password_validation import validate_password
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..serializers import RegisterSerializer
from ..validators import EmailValidator, UsernameValidator

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
                "error": e.detail[0],
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
                "error": "비밀번호를 입력해주세요.",
            }, status=status.HTTP_400_BAD_REQUEST)
        if password != password2:
            return Response(data={
                "error": "비밀번호가 일치하지 않습니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(password)
        except ValidationError as e:
            return Response(data={
                "error": e.detail[0],
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "사용 가능한 비밀번호입니다."}, status=status.HTTP_200_OK)

class RegisterView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['post', 'head', 'options']

    @extend_schema(summary="회원가입", tags=["회원 관리"])
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError:
            return Response(data={"error": "오류가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "created"}, status=status.HTTP_201_CREATED)
