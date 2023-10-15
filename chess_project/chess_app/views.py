from django.shortcuts import render

# Create your views here.
from django.shortcuts import render


def chess_board(request):
    return render(request, "chess_app/chess_board.html")


def animation(request):
    return render(request, template_name="chess_app/animation.js")
