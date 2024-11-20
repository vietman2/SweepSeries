from django.contrib import admin

## Auth
from auth.agreements.models import Agreement
from auth.person.models import Person
from auth.user.models import User

admin.site.register(Agreement)
admin.site.register(Person)
admin.site.register(User)



## Remove default models
from django.contrib.auth.models import Group
from allauth.account.models import EmailAddress
from rest_framework.authtoken.models import TokenProxy
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

unnecessary_models = [Group, EmailAddress, TokenProxy, OutstandingToken, BlacklistedToken]

for model in unnecessary_models:
    if model in admin.site._registry:
        admin.site.unregister(model)
