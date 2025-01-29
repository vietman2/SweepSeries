import requests
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from auth.person.models import Person
from .models import PhoneVerification
from .serializers import RegisterSerializer
from .utils import generate_verification_code
from .validators import EmailValidator, UsernameValidator

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

class CreateVerificationCodeView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['post', 'head', 'options']

    @extend_schema(summary="전화번호 인증", tags=["회원 관리"])
    def post(self, request):
        phone_number = request.data.get('phone', None)

        if not phone_number:
            return Response(data={
                "error": "전화번호를 입력해주세요.",
            }, status=status.HTTP_400_BAD_REQUEST)

        if Person.objects.filter(phone_number=phone_number).exists():
            return Response(data={
                "error": "이미 가입된 전화번호입니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        code = generate_verification_code()
        message = f"[스윕시리즈] 회원가입을 위한 인증번호 [{code}]를 입력해주세요."

        try:
            res = requests.post(
                "https://apis.aligo.in/send/",
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data={
                    "key": settings.SMS_API_KEY,
                    "user_id": "sweepseries",
                    "sender": "15771485",
                    "receiver": phone_number,
                    "msg": message,
                    "testmode_yn": "Y",     ## TOOO: Switch this
                }
            )

            if int(res.json()['result_code']) != 1:
                return Response(data={
                    "error": "인증번호 전송에 실패했습니다.",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except requests.RequestException:
            return Response(data={
                "error": "인증번호 전송에 실패했습니다.",
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        PhoneVerification.objects.create(phone_number=phone_number, verification_code=code)

        return Response(data={"message": "created"}, status=status.HTTP_200_OK)

class VerifyPhoneView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['post', 'head', 'options']

    @extend_schema(summary="전화번호 인증 확인", tags=["회원 관리"])
    def post(self, request):
        phone_number = request.data.get('phone', None)
        verification_code = request.data.get('code', None)

        if not phone_number or not verification_code:
            return Response(data={
                "error": "전화번호와 코드를 입력해주세요.",
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            phone_verification = PhoneVerification.objects.filter(phone_number=phone_number).latest('created_at')
        except PhoneVerification.DoesNotExist:
            return Response(data={
                "error": "인증번호를 발급받지 않았습니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        if phone_verification.verification_code != verification_code:
            return Response(data={
                "error": "인증번호가 일치하지 않습니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        ## Check if the code is expired: 3 minutes
        if (timezone.now() - phone_verification.created_at).seconds > 180:
            return Response(data={
                "error": "인증번호가 만료되었습니다.",
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response(data={"message": "인증되었습니다."}, status=status.HTTP_200_OK)

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
