from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import *
import json
import time
from .kanoodle import Kanoodle
from io import BytesIO
from PIL import Image
from django.http import FileResponse


@require_http_methods(["POST"])
def submit_kanoodle_problem(request):
    data = json.loads(request.body)
    piece_descriptions = data['piece_descriptions']
    grid_width = data['grid_width']
    grid_height = data['grid_height']

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
    pieces_data = {}
    for piece in PuzzlePiece.objects.all():
        pieces_data[piece.shape] = {
            'shape': piece.shape,
            'grid': piece.get_grid(),
            'image_path': piece.image_path,
            'rotation': piece.rotation
        }
    return pieces_data

def generate_solution_image(solution_matrix, pieces_data, block_size=50):
    solution_width = len(solution_matrix[0]) * block_size
    solution_height = len(solution_matrix) * block_size
    solution_image = Image.new('RGBA', (solution_width, solution_height),
                               (255, 255, 255, 0))  # Create a transparent solution image

    for row_idx, row in enumerate(solution_matrix):
        for col_idx, piece_symbol in enumerate(row):
            if piece_symbol in pieces_data:  # Make sure the piece symbol exists in the data
                piece_data = pieces_data[piece_symbol]
                display_piece(piece_data, row_idx, col_idx, block_size, solution_image)


    # Instead of showing the image, save it to an in-memory file
    image_io = BytesIO()
    solution_image.save(image_io, 'PNG')
    image_io.seek(0)

    return image_io


# Django view that returns an image response
def solution_view(request):
    data = json.loads(request.body)
    solution_matrix = data['solution_matrix']
    pieces_data = get_pieces_data()

    image_io = generate_solution_image(solution_matrix, pieces_data)
    return FileResponse(image_io, as_attachment=True, filename='solution.png')

def display_piece(piece_data, row, col, block_size, solution_image):
    # Open the image file corresponding to the piece
    with Image.open(piece_data['image_path']) as piece_image:

        # Apply rotations to images
        if piece_data['rotation'] != 0:
            piece_image = piece_image.rotate(piece_data['rotation'], expand=True)

        # Resize the image if necessary
        piece_image = piece_image.resize((block_size, block_size))

        # Calculate the position to paste the piece image, accounting for the block size
        position = (col * block_size, row * block_size)

        # Paste the piece image onto the solution image at the calculated position
        solution_image.paste(piece_image, position, piece_image)  # Use mask=piece_image to handle transparency
