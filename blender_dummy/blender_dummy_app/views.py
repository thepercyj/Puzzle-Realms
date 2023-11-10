import shutil

from django.conf import settings
import tempfile
import zipfile

from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from .models import *
import json
import time
from .kanoodle import Kanoodle
from io import BytesIO
from PIL import Image
from django.http import FileResponse
from .puzzle_pieces import PuzzlePieces
import os

grid_width = 3
grid_height = 3


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
                               (255, 255, 255))  # Create a transparent solution image

    # for row_idx, row in enumerate(solution_matrix):
    #     for col_idx, piece_symbol in enumerate(row):
    #         if piece_symbol in pieces_data:  # Make sure the piece symbol exists in the data
    #             print(piece_symbol)
    #             piece_symbol = pieces_data[piece_symbol]
    #             display_piece(piece_symbol, row_idx, col_idx, block_size, solution_image)


    # Instead of showing the image, save it to an in-memory file
    image_io = BytesIO()
    solution_image.save(image_io, 'PNG')
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
    return solutions



def generate_solution_gallery(request):

    solutions = get_list_of_solution_matrices()
    pieces_data = get_pieces_data()

    # Create a temporary directory within MEDIA_ROOT
    media_dir = os.path.join(settings.MEDIA_ROOT)
    if not os.path.exists(media_dir):
        os.makedirs(media_dir)

    # Temporary storage for images
    fs = FileSystemStorage(location=media_dir)

    # Clears the media folder of existing files before generating the new ones
    clear_solutions(media_dir)

    # List to hold the paths of the generated images
    image_paths = []

    # Loop through each solution, generating an image for it and adding the path to the file
    for idx, solution_matrix in enumerate(solutions):
        image_io = generate_solution_image(solution_matrix, pieces_data)
        filename = f'solution_{idx}.png'
        image_path = fs.save(filename, image_io)
        image_paths.append(fs.url(image_path))

    # Pass the image paths to the template
    return render(request, 'blender_dummy_app/solutions.html', {'image_paths': image_paths})


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


def solution_view(request):
    # Retrieve the list of solution matrices
    solutions = get_list_of_solution_matrices()  # You need to define this function

    # Create a BytesIO object to write the zip file in memory
    in_memory_zip = BytesIO()

    # Create a zip file object using the in-memory BytesIO object
    with zipfile.ZipFile(in_memory_zip, 'w') as zf:
        for idx, solution_matrix in enumerate(solutions):
            pieces_data = get_pieces_data()
            image_io = generate_solution_image(solution_matrix, pieces_data)
            image_io.seek(0)
            # Write the image to the zip file, naming each file using the index of the solution
            zf.writestr(f'solution_{idx}.png', image_io.read())

    # Reset file pointer
    in_memory_zip.seek(0)

    # Set up the HTTP response with the correct content-type
    response = HttpResponse(in_memory_zip, content_type='application/zip')
    response['Content-Disposition'] = 'attachment; filename="solutions.zip"'

    return response

# puzzle_piece_index = 1

def display_piece(piece_data, row, col, block_size, solution_image):
    # global puzzle_piece_index

    image_path = piece_data['image_path']
    # Open the image file corresponding to the piece
    with Image.open(image_path) as piece_image:
        # piece_image.save(f'blender_dummy_app/puzzle_piece_test/puzzle_piece_{puzzle_piece_index}.png')

        # Apply rotations to images
        if piece_data['rotation'] != 0:
            piece_image = piece_image.rotate(piece_data['rotation'], expand=True)

        # Resize the image if necessary
        piece_image = piece_image.resize((block_size, block_size))

        # Calculate the position to paste the piece image, accounting for the block size
        position = (col * block_size, row * block_size)

        # Paste the piece image onto the solution image at the calculated position
        solution_image.paste(piece_image, position, piece_image)  # Use mask=piece_image to handle transparency

    # puzzle_piece_index += 1
