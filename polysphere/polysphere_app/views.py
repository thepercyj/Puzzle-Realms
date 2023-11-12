import os
import shutil
import time
from io import BytesIO
from PIL import Image
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .kanoodle import Kanoodle
from .models import *
from .puzzle_pieces import PuzzlePieces

# Sets the grid height and width
grid_width = 11
grid_height = 5

# Set global start_time
start_time = time.time()
end_time = 0

@require_http_methods(["POST"])
def submit_kanoodle_problem(request):
    # Assume data is now coming from a predefined function or file
    piece_descriptions = get_pieces_data()
    grid_width = 3
    grid_height = 3

    # Create a KanoodleProblem instance and store in the database
    problem = KanoodleProblem.objects.create(
        piece_descriptions=json.dumps(piece_descriptions),
        grid_width=grid_width,
        grid_height=grid_height
    )

    # Solve the problem using Kanoodle logic
    start_time = time.time()
    solutions_str = Kanoodle.findAllSolutions(piece_descriptions, grid_width, grid_height)
    end_time = time.time()

    # Create a KanoodleSolution instance and store in the database
    KanoodleSolution.objects.create(problem=problem, solution_data=solutions_str)

    # Return the response
    return JsonResponse({
        'problem_id': problem.id,
        'solution': solutions_str,
        'time_taken_ms': (end_time - start_time) * 1000
    }, status=201)


@require_http_methods(["GET"])
def get_kanoodle_solution(request, problem_id):
    try:
        # Retrieve the problem and its solutions
        problem = KanoodleProblem.objects.get(id=problem_id)
        solutions = problem.solutions.all()

        # Format the solutions for the response
        solutions_data = [sol.get_solution_data() for sol in solutions]
        return JsonResponse({
            'problem_id': problem_id,
            'solutions': solutions_data
        })
    except KanoodleProblem.DoesNotExist:
        return JsonResponse({'error': 'Problem not found.'}, status=404)


def get_pieces_data():
    puzzle_pieces_data = PuzzlePieces.pieces_data.copy()
    for piece in PuzzlePiece.objects.all():
        puzzle_pieces_data[piece.shape] = {
            'shape': piece.shape,
            'grid': piece.get_grid(),
            'image_path': piece.image_path,
            'rotation': piece.rotation
        }

    return puzzle_pieces_data


def generate_solution_image(solution_matrix, pieces_data, block_size=50):
    solution_width = len(solution_matrix[0]) * block_size
    solution_height = len(solution_matrix) * block_size
    solution_image = Image.new('RGB', (solution_width, solution_height),
                               (128, 128, 128))  # Create grey background image

    for row_idx, row in enumerate(solution_matrix):
        for col_idx, piece_symbol in enumerate(row):
            if piece_symbol in pieces_data:  # Make sure the piece symbol exists in the data
                piece_symbol = pieces_data[piece_symbol]
                # Ensure the position is calculated correctly: (x, y) format
                position = (col_idx * block_size, row_idx * block_size)
                # print(f"Placeing {piece_symbol} at {position}, Image Size: {solution_image.size}")
                display_piece(piece_symbol, position, block_size, solution_image)

    # Instead of showing the image, save it to an in-memory file
    image_io = BytesIO()
    solution_image.save(image_io, 'WebP')
    image_io.seek(0)

    return image_io


# Django view that returns an image response
def get_list_of_solution_matrices():

    kanoodle_solver = Kanoodle()

    # Directly use the pieces_data to get the list of grids
    list_of_grids = [value['grid'] for key, value in PuzzlePieces.pieces_data.items()]
    grid_strings = []
    for grid in list_of_grids:
        grid_strings.append("\n".join(grid))

    # Call the findAllSolutions method with the list of grids and the puzzle dimensions
    solutions = kanoodle_solver.findAllSolutions(grid_strings, grid_width, grid_height)

    global end_time
    end_time = time.time()
    solutions = solutions.split("\n\n")
    return solutions


def generate_solution_gallery(request):
    # solutions = get_list_of_solution_matrices()
    # solutions = [solution.split("\n") for solution in solutions]
    # time_taken = end_time - start_time
    # print(f"{len(solutions)} solutions found in {time_taken}")
    # pieces_data = get_pieces_data()

    # Create a temporary directory within MEDIA_ROOT
    media_dir = os.path.join(settings.MEDIA_ROOT)
    if not os.path.exists(media_dir):
        os.makedirs(media_dir)

    # Temporary storage for images
    fs = FileSystemStorage(location=media_dir)

    # Clears the media folder of existing files before generating the new ones
    # clear_solutions(media_dir)

    # List to hold the paths of the generated images
    image_paths = []

    # Loop through each solution, generating an image for it and adding the path to the file
    for idx in range(0, 80444):
        # image_io = generate_solution_image(solution_matrix, pieces_data)
        filename = f'solution_{idx}.webp'
        image_path = fs.url(filename)
        image_paths.append(image_path)

    # Pass the image paths to the template
    return render(request, 'polysphere_app/solutions.html', {'image_paths': image_paths})


def clear_solutions(directory):
    for filename in os.listdir(directory):
        if filename.startswith("solution"):
            file_path = os.path.join(directory, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print('Failed to delete %s. Reason: %s' % (file_path, e))


def display_piece(piece_data, position, block_size, solution_image):
    image_path = piece_data['image_path']
    # Open the image file corresponding to the piece
    with Image.open(image_path) as piece_image:
        # Apply rotations to images
        if piece_data['rotation'] != 0:
            piece_image = piece_image.rotate(piece_data['rotation'], expand=True)

        # Resize the image if necessary
        piece_image = piece_image.resize((block_size, block_size))

        # Check if the piece fits within the solution image
        if position[0] + piece_image.width <= solution_image.width and position[
            1] + piece_image.height <= solution_image.height:
            # Paste the piece image onto the solution image at the calculated position
            solution_image.paste(piece_image, position, piece_image)
