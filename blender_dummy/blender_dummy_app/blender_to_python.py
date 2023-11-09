from PIL import Image


def display_solution(solution_matrix, pieces_data, block_size=50):
    solution_width = len(solution_matrix[0]) * block_size
    solution_height = len(solution_matrix) * block_size
    solution_image = Image.new('RGBA', (solution_width, solution_height), (255, 255, 255, 0))  # Create a transparent solution image

    for row_idx, row in enumerate(solution_matrix):
        for col_idx, piece_symbol in enumerate(row):
            if piece_symbol in pieces_data:  # Make sure the piece symbol exists in the data
                piece_data = pieces_data[piece_symbol]
                display_piece(piece_data, row_idx, col_idx, block_size, solution_image)

    solution_image.show()  # This will display the image using the default image viewer


def display_piece(piece_data, row, col, block_size, solution_image):
    # Open the image file corresponding to the piece
    with Image.open(piece_data['image_path']) as piece_image:

        # Apply rotations to images
        if piece_data['rotation'] is not 0:
            piece_image = piece_image.rotate(piece_data['rotation'], expand=True)

        # Resize the image if necessary
        piece_image = piece_image.resize((block_size, block_size))

        # Calculate the position to paste the piece image, accounting for the block size
        position = (col * block_size, row * block_size)

        # Paste the piece image onto the solution image at the calculated position
        solution_image.paste(piece_image, position, piece_image)  # Use mask=piece_image to handle transparency

# Example usage
solution_matrix = [
    ['A', 'A', 'A', 'G', 'G', 'G', 'I', 'I', 'L', 'L', 'J'],
    ['B', 'B', 'A', 'K', 'K', 'G', 'I', 'L', 'L', 'J', 'J'],
    ['B', 'B', 'K', 'K', 'D', 'G', 'I', 'I', 'L', 'H', 'J'],
    ['C', 'B', 'D', 'D', 'D', 'D', 'E', 'E', 'H', 'H', 'F'],
    ['C', 'C', 'C', 'E', 'E', 'E', 'H', 'H', 'F', 'F', 'F']
]

display_solution(solution_matrix, pieces_data)
