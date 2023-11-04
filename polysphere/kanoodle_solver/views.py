from django.shortcuts import render
from .forms import PuzzleUploadForm
from .solve_puzzle import solve_puzzle


def solve_puzzle_view(request):
    if request.method == 'POST':
        form = PuzzleUploadForm(request.POST, request.FILES)
        if form.is_valid():
            puzzle_input = request.FILES['puzzle_input']
            pieces = puzzle_input.read().decode('utf-8').split('\n\n')

            # Solve the puzzle
            solutions = solve_puzzle(pieces)

            # Save solutions to the database
            for solution in solutions:
                PuzzleSolution.objects.create(solution_text=solution)

            return render(request, 'kanoodle_solver/solution_list.html', {'solutions': solutions})
    else:
        form = PuzzleUploadForm()

    return render(request, 'kanoodle_solver/upload_puzzle.html', {'form': form})
