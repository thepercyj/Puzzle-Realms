# Create your views here.
from django.shortcuts import render, redirect
from .nqueens_solver import solve_n_queens


# This function calls the template file where the HTML code to display in the web canvas is located.
def landing(request):
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        request.session['data_from_landing'] = data_from_landing
        return redirect('nqueens:levels')
    else:
        return render(request, 'nqueens_app/landing.html')


def levels(request):
    data_from_landing = request.session.get('data_from_landing', '')
    return render(request, 'nqueens_app/levels.html', {'data_from_landing': data_from_landing})


def nqueens(request):
    n = request.GET.get('n', 4)
    n = int(n)
    solutions = solve_n_queens(n)
    data_from_landing = request.session.get('data_from_landing', '')

    return render(request, 'nqueens_app/nqueens.html',
                  {'data_from_landing': data_from_landing, 'n': n, 'solutions': solutions})
