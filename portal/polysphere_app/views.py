import os
import shutil
import time
from io import BytesIO
from PIL import Image
from django.db.backends import mysql
import mysql.connector
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from .kanoodle import Kanoodle
from .models import *
from .puzzle_pieces import PuzzlePieces
import re

# Sets the grid height and width
grid_width = 11
grid_height = 5

# Set global start_time
start_time = time.time()
end_time = 0


def landing(request):
    """
    Renders the landing page and handles the form submission.

    If the request method is POST, it retrieves the data from the landing form,
    stores it in the session, and redirects to the 'levels' view.
    If the request method is GET, it renders the landing.html template.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response object.
    """
    if request.method == 'POST':
        data_from_landing = request.POST.get('data_from_landing', '')
        request.session['data_from_landing'] = data_from_landing
        return redirect('polysphere:levels')
    else:
        return render(request, 'polysphere_app/landing.html')


def levels(request):
    """
    Renders the 'levels.html' template and passes the 'data_from_landing' variable from the session to the template.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The rendered response.
    """
    data_from_landing = request.session.get('data_from_landing', '')
    return render(request, 'polysphere_app/levels.html', {'data_from_landing': data_from_landing})


@require_http_methods(["POST"])
def submit_kanoodle_problem(request):
    """
    Submits a Kanoodle problem to the server and returns the solution.

    Args:
        request: The HTTP request object.

    Returns:
        A JSON response containing the problem ID, solution, and time taken in milliseconds.
    """
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
    """
    Retrieve the Kanoodle problem and its solutions.

    Args:
        request (HttpRequest): The HTTP request object.
        problem_id (int): The ID of the Kanoodle problem.

    Returns:
        JsonResponse: The JSON response containing the problem ID and its solutions.

    Raises:
        KanoodleProblem.DoesNotExist: If the Kanoodle problem with the given ID does not exist.
    """
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
    """
    Retrieves the data of puzzle pieces.

    Returns:
        dict: A dictionary containing the data of puzzle pieces, including shape, grid, image path, and rotation.
    """
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
    """
    Generate a solution image based on the solution matrix and pieces data.

    Args:
        solution_matrix (list): A 2D matrix representing the solution.
        pieces_data (dict): A dictionary mapping piece symbols to their corresponding image data.
        block_size (int, optional): The size of each block in pixels. Defaults to 50.

    Returns:
        BytesIO: An in-memory file containing the generated solution image.
    """
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
    """
    Retrieves a list of solution matrices for the Kanoodle puzzle.

    Returns:
        list: A list of solution matrices.
    """
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
    """
    Generates a solution gallery by looping through each solution,
    generating an image for it, and adding the path to the file.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        HttpResponse: The HTTP response object.
    """
    # Rest of the code...
def generate_solution_gallery(request):
    # solutions = get_list_of_solution_matrices()
    # solutions = [solution.split("\n") for solution in solutions]
    # time_taken = end_time - start_time
    # print(f"{len(solutions)} solutions found in {time_taken}")
    # pieces_data = get_pieces_data()

    # Create a temporary directory within MEDIA_ROOT
    # media_dir = os.path.join(settings.MEDIA_ROOT)
    # if not os.path.exists(media_dir):
    #     os.makedirs(media_dir)
    #
    # # Temporary storage for images
    # fs = FileSystemStorage(location=media_dir)

    # Clears the media folder of existing files before generating the new ones
    # clear_solutions(media_dir)

    # List to hold the paths of the generated images
    image_paths = []

    # Loop through each solution, generating an image for it and adding the path to the file
    for idx in range(0, 80444):
        # image_io = generate_solution_image(solution_matrix, pieces_data)
        # filename = f'media/solution_{idx}.webp'
        # image_path = fs.url(filename)
        image_path = f'media/solution_{idx}.webp'
        image_paths.append(image_path)

        data_from_landing = request.session.get('data_from_landing', '')
        return render(request, 'polysphere_app/kanoodle-solver.html', {'data_from_landing': data_from_landing})

    # return render(request, 'polysphere_app/kanoodle-solver.html')
    # return render(request, 'polysphere_app/dashboard.html', {'image_paths': image_paths})


def clear_solutions(directory):
    """
    Clears all the solution files and directories in the given directory.

    Args:
        directory (str): The path to the directory containing the solution files.

    Returns:
        None
    """
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
    """
    Display a piece on the solution image at the specified position.

    Args:
        piece_data (dict): The data of the piece, including its image path and rotation.
        position (tuple): The position where the piece should be placed on the solution image.
        block_size (int): The size of each block in the solution image.
        solution_image (PIL.Image.Image): The solution image.

    Returns:
        None
    """
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


def generate_regex_pattern(partial_solution):
    """
    Generate a regular expression pattern based on a partial solution.

    Args:
        partial_solution (list): A 2D list representing a partial solution.

    Returns:
        str: The regular expression pattern generated from the partial solution.
    """
    pattern = ""
    for row in partial_solution:
        row_pattern = ""
        for cell in row:
            if cell == ' ':
                row_pattern += '.'  # Any character
            else:
                row_pattern += cell  # Specific character
        pattern += row_pattern + "\n"
    return pattern.rstrip("\n")


def find_partial_solutions(request):
    """
    Finds partial solutions based on the given request.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        JsonResponse: The JSON response containing the partial solutions or an error message.
    """
    # If a request sent from the webpage
    if request.method == 'POST':
        # Assigns a variable to the partial configuration and generates a regex pattern from it
        configuration = json.loads(request.body)
        regex_pattern = generate_regex_pattern(configuration)
        # Opens the solutions.txt file
        with open(
                r'polysphere_app/solutions/all_solutions.txt',
                'r') as file:
            solutions_text = file.read()
        # Split the text into individual solutions
        raw_solutions = solutions_text.strip().split('\n\n')
        # Format each solution with newline characters
        formatted_solutions = ['\n'.join(solution.split('\n')) for solution in raw_solutions]

        # Matches pattern to solutions
        matching_solutions = []
        for solution in formatted_solutions:
            if re.match(regex_pattern, solution, re.DOTALL):
                matching_solutions.append(solution)
        # Gets the matching solutions' image_paths from database
        return get_partial_solutions(matching_solutions)

    else:
        return JsonResponse({'error:': 'Invalid request'}, status=400)


def get_partial_solutions(matching_solutions):
    """
    Retrieves partial solutions from the database based on the given matching solutions.

    Args:
        matching_solutions (list): A list of matching solutions.

    Returns:
        dict: A JSON response containing the image paths of the matching patterns.
    """
    # Establish database connection
    conn = mysql.connector.connect(host='144.21.52.245', port='6969', user='asegroup6', passwd='ASEgroup6mysql@2023##',
                                   db='group_6_project')
    # conn = mysql.connector.connect(host='localhost', port='3306', user='root', passwd='',
    #                                db='group_6_project')
    cursor = conn.cursor()
    print(len(matching_solutions))
    # Gets matching patterns from the database
    img_paths = []
    for match in matching_solutions:
        print("Match found:", match)
        query = "SELECT img_path FROM kanoodle_solver WHERE mapping LIKE %s"
        match_with_wildcard = f"%{match}%"
        cursor.execute(query, (match_with_wildcard,))
        img_paths.extend([row[0] for row in cursor.fetchall()])
    cursor.close()
    conn.close()
    # Returns a Json response
    return JsonResponse({'img_paths': img_paths})
