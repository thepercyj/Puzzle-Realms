# Create your views here.
from django.shortcuts import render
from .nqueens_solver import solve_n_queens


# This function calls the template file where the HTML code to display in the web canvas is located.
def nqueens(request):
    n = request.GET.get('n', 4)  # Default to 4 if n is not provided when first web page is loaded initially
    n = int(n)
    solutions = solve_n_queens(n)
    return render(request, 'nqueens_app/nqueens.html', {'n': n, 'solutions': solutions})
