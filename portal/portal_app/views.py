from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.views import LogoutView
from django.shortcuts import reverse


# Create your views here.
def portal(request):
    return render(request, 'portal_app/dashboard.html')


def team(request):
    return render(request, 'portal_app/game1.html')


def games(request):
    return render(request, 'portal_app/games.html')


def nqueens_game(request):
    return render(request, 'portal_app/game1.html')


def polysphere_game(request):
    return render(request, 'portal_app/game2.html')


def polysphere3D_game(request):
    return render(request, 'portal_app/game3.html')


def custom_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')  # Assuming you have a remember_me checkbox in your form

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if not remember_me:
                # If remember_me is not checked, set session expiry to 0 (session cookie)
                request.session.set_expiry(0)
            return reverse('portal')  # Replace 'dashboard' with the name of your dashboard URL pattern

    return render(request, 'portal_app/dashboard.html')


class CustomLogoutView(LogoutView):
    def get_next_page(self):
        next_page = super().get_next_page()
        if next_page:
            return next_page
        return reverse('portal')
