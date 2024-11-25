from django import forms
from django.contrib import admin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from auth.person.models import Person
from auth.userprofile.models import UserProfile
from .models import User

class CustomUserCreationForm(forms.ModelForm):
    """Form for creating new users."""
    password    = forms.CharField(widget=forms.PasswordInput)
    person      = forms.ModelChoiceField(queryset=Person.objects.all())

    class Meta:
        model = User
        fields = ('email', 'username', 'is_staff', 'is_active', 'person')

    def clean_password(self):
        password = self.cleaned_data.get('password')
        return password

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        else:
            return user

        UserProfile.objects.create(user=user)

        return user

class CustomUserChangeForm(forms.ModelForm):
    """Form for updating users."""
    ## make password read-only
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('email', 'username', 'is_active', 'is_staff')

class UserAdmin(admin.ModelAdmin):
    form = CustomUserChangeForm  # Form for editing users
    add_form = CustomUserCreationForm  # Form for creating users

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'person', 'is_staff', 'is_active'),
        }),
    )

    fieldsets = (
        (None, {'fields': ('email', 'username', 'password', 'person')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )

    def get_form(self, request, obj=None, change=False, **kwargs):
        if obj is None:
            kwargs['form'] = self.add_form
        else:
            kwargs['form'] = self.form
        return super().get_form(request, obj, change, **kwargs)
