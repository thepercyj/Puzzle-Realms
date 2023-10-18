# Create your views here.
from django.shortcuts import render
from .nqueens_solver import solve_n_queens


def nqueens(request):
    n = request.GET.get('n', 4)  # Default to 4 if n is not provided
    n = int(n)
    solutions = solve_n_queens(n)
    return render(request, 'nqueens_app/nqueens.html', {'n': n, 'solutions': solutions})
