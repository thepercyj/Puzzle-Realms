from django.shortcuts import render

# Create your views here.

def game_board(request):
    return render(request, 'polysphere_app/polysphere.html')
from .models import PuzzlePiece
from .solve_puzzle import solve_puzzle


def solve_puzzle_view(request):
    # Load puzzle pieces from the input file
    pieces = [
        " A\n A\nAA",
        " B\nBB\nBB",
        " C\n C\n C\nCC",
        " D\n D\nDD\n D",
        " E\n E\nEE\nE",
        "F\nFF",
        "  G\n  G\nGGG",
        "  H\n HH\nHH",
        "I I\nIII",
        "J\nJJ\nJ",
        " KK\nKK",
        " L\nLL\n LL"
    ]

    # Solve the puzzle
    solved_board = solve_puzzle(pieces)

    context = {
        'solved_puzzle': solved_board
    }

    return render(request, 'polysphere_app/solved_puzzle.html', context)
