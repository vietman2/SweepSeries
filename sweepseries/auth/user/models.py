import uuid
from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from auth.person.models import Person
from .managers import UserManager
from .utils import generate_verification_code

class User(AbstractBaseUser):
    uuid            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username        = models.CharField(max_length=150, unique=True)
    email           = models.EmailField(unique=True)
    person          = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='user')

    joined_at       = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    is_superuser    = models.BooleanField(default=False)
    is_staff        = models.BooleanField(default=False)
    is_blocked      = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    naver_linked    = models.BooleanField(default=False)
    kakao_linked    = models.BooleanField(default=False)

    noti_permitted  = models.BooleanField(default=False)
    agreed_at       = models.DateTimeField(null=True, blank=True)

    ## 캘린더 설정 (개인 캘린더)
    calendar_title      = models.CharField(max_length=50, default="나만의 캘린더")
    calendar_color      = models.CharField(max_length=7, default="#FF6B6B")
    notifications       = models.BooleanField(default=True)
    notifications_today = models.BooleanField(default=True)
    daily_time          = models.TimeField(null=True, blank=True, default="09:00:00")

    USERNAME_FIELD  = 'username'

    def has_perm(self, perm, obj=None): # pylint: disable=unused-argument
        return True

    def has_module_perms(self, app_label):  # pylint: disable=unused-argument
        return True

    objects         = UserManager()

    def __str__(self):
        return f"{self.username} ({self.person.name})" # pylint: disable=no-member

    class Meta:
        db_table    = 'user'
        verbose_name = '회원'
        verbose_name_plural = '회원'

class PhoneVerification(models.Model):
    phone_number        = models.CharField(max_length=20)
    verification_code   = models.CharField(max_length=6, default=generate_verification_code)
    created_at          = models.DateTimeField(auto_now_add=True)

    objects             = models.Manager()

    class Meta:
        db_table    = 'phone_verification'
        verbose_name = '휴대폰 인증'
        verbose_name_plural = '휴대폰 인증'
