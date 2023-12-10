# Create your views here.
from django.shortcuts import render
from .nqueens_solver import solve_n_queens


# This function calls the template file where the HTML code to display in the web canvas is located.
def nqueens(request):
    n = request.GET.get('n', 4)  # Default to 4 if n is not provided when first web page is loaded initially
    n = int(n)
    solutions = solve_n_queens(n)
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        return render(request, 'nqueens_app/nqueens.html', {'data_from_landing': data_from_landing, 'n': n, 'solutions': solutions})
    else:
        return render(request, 'nqueens_app/nqueens.html', {'data_from_landing': '', 'n': n, 'solutions': solutions})


def landing(request):
    current_app = 'nqueens_app'
    return render(request, 'nqueens_app/landing.html', {'current_app': current_app})
