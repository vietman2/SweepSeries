import uuid
from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from auth.person.models import Person
from .managers import UserManager

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

    USERNAME_FIELD  = 'username'

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    objects         = UserManager()

    def __str__(self):
        return f"{self.username} ({self.person.full_name})"

    class Meta:
        db_table    = 'user'
        verbose_name = '회원'
        verbose_name_plural = '회원'
