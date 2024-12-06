from django.contrib.auth.base_user import BaseUserManager

from auth.person.models import Person
from auth.userprofile.models import UserProfile

class UserManager(BaseUserManager):
    def create_user(self, password=None, **extra_fields):
        user = self.model(
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, password=None, **extra_fields):
        person = Person.objects.create(
            name='Admin',
            phone_number='010-1234-1234'
        )
        extra_fields['person'] = person
        user = self.create_user(password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True

        user.save(using=self._db)

        UserProfile.objects.create(user=user)

        return user
