from django.shortcuts import render

# Create your views here.

def game_board(request):
    return render(request, 'game_board.html')