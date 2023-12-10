from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path, reverse_lazy
from django.views.generic.edit import CreateView
from .forms import CustomUserLoginForm, CustomUserRegistrationForm
from .models import CustomUser
from . import views


urlpatterns = [
    path('', views.portal, name='portal'),
    path('login/', LoginView.as_view(template_name='portal_app/login.html', next_page='portal', authentication_form=CustomUserLoginForm),
         name='login'),
    path('logout/', LogoutView.as_view(next_page='portal'), name='logout'),
    path('register/',
         CreateView.as_view(template_name='portal_app/register.html', form_class=CustomUserRegistrationForm, model=CustomUser,
                            success_url=reverse_lazy('login')), name='register'),
]
