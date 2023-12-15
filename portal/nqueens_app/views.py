# Create your views here.
from django.shortcuts import render, redirect
from .nqueens_solver import solve_n_queens


def landing(request):
    """
    Renders the landing page and handles the form submission.

    If the request method is POST, it retrieves the data from the landing form,
    stores it in the session, and redirects to the 'levels' view.
    If the request method is GET, it renders the landing.html template.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - If the request method is POST, it redirects to the 'levels' view.
    - If the request method is GET, it renders the landing.html template.
    """
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        request.session['data_from_landing'] = data_from_landing
        return redirect('nqueens:levels')
    else:
        return render(request, 'nqueens_app/landing.html')


def levels(request):
    """
    Renders the 'levels.html' template and passes the 'data_from_landing' variable to it.

    Args:
        request: The HTTP request object.

    Returns:
        A rendered HTML response.
    """
    data_from_landing = request.session.get('data_from_landing', '')
    return render(request, 'nqueens_app/levels.html', {'data_from_landing': data_from_landing})


def nqueens(request):
    """
    Solve the N-Queens problem and render the solutions to the nqueens.html template.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The rendered nqueens.html template with the solutions.

    """
    n = request.GET.get('n', 4)
    n = int(n)
    solutions = solve_n_queens(n)
    data_from_landing = request.session.get('data_from_landing', '')

    return render(request, 'nqueens_app/nqueens.html',
                  {'data_from_landing': data_from_landing, 'n': n, 'solutions': solutions})


def nqueens_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/index.html')


def nqueens_admin_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/admin.html')


def nqueens_apps_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/apps.html')


def nqueens_models_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/models.html')


def nqueens_solver_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/nqueens_solver.html')


def nqueens_tests_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/tests.html')


def nqueens_urls_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/urls.html')


def nqueens_views_doc(request):
    return render(request, 'nqueens_app/html/nqueens_app/views.html')
