from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    def get_queryset(self):
        return super().get_queryset()

    def create_user(self, password=None, **extra_fields):
        user = self.model(
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user
