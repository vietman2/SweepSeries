from django.contrib import admin
## Models to unregister
from django.contrib.auth.models import Group
from allauth.account.models import EmailAddress
from rest_framework.authtoken.models import TokenProxy
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

## Models to register
## Auth
from auth.agreements.models import Agreement
from auth.person.models import Person
from auth.user.models import User

## Community
from community.tag.models import Tag

admin.site.register(Agreement)
admin.site.register(Person)
admin.site.register(User)

admin.site.register(Tag)

unnecessary_models = [Group, EmailAddress, TokenProxy, OutstandingToken, BlacklistedToken]

for model in unnecessary_models:
    admin.site.unregister(model)
