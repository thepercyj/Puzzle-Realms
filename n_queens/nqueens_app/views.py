from django.shortcuts import render

# Create your views here.
from django.shortcuts import render


def nqueens_board(request):
    return render(request, "nqueens_app/nqueens.html")
