from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import CustomUser  # Import your CustomUser model


class CustomUserLoginForm(AuthenticationForm):
    remember_me = forms.BooleanField(required=False, initial=False,
                                     widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}))

    class Meta:
        model = CustomUser  # Use your CustomUser model
        fields = ('username', 'password', 'remember_me')


class CustomUserRegistrationForm(UserCreationForm):
    class Meta:
        model = CustomUser  # Use your CustomUser model
        fields = ('username', 'password1', 'password2')
