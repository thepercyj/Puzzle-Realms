# Define pyramid levels dimensions
from kanoodle_3d import *
pyramidLevels = 5

# Define the pieces
Pieces = [
    "A A \n" +
    "AAA \n",

    " B  \n" +
    " B  \n" +
    "BB  \n" +
    "B   \n",

    " C  \n" +
    "CC  \n" +
    " CC \n",

    "D   \n" +
    "DD  \n" +
    "D   \n",

    " E  \n" +
    " E  \n" +
    "EE  \n" +
    " E  \n",

    " F  \n" +
    "FF  \n" +
    "FF  \n",

    " GG  \n" +
    "GG  \n",

    " H  \n" +
    " H  \n" +
    "HH  \n",

    "  I \n" +
    "  I \n" +
    "III \n",

    " J  \n" +
    " J  \n" +
    " J  \n" +
    "JJ  \n",

    "K   \n" +
    "KK  \n",

    "  L \n" +
    " LL \n" +
    "LL  \n",
]


def generate_pyramid_board_representation(levels):
    """
    Generate a 3D array representation of a n-level pyramid board for the Extreme Kanoodle.
    Each cell in the array is marked with an 'X'.
    Returns the 3D array representing the pyramid.
    """
    pyramid_representation = []

    # Each level in the pyramid
    for level in range(levels, 0, -1):
        # Create a 2D array for the current level
        level_array = []

        for row in range(level):
            # Create a row with 'X's
            row_array = [' ' for _ in range(level)]
            level_array.append(row_array)

        pyramid_representation.append(level_array)

    return pyramid_representation


# Generating the pyramid board representation
board_representation = generate_pyramid_board_representation(pyramidLevels)


level_num = 1
print(board_representation)
print(type(Pieces))
# Find a solution for the pyramid puzzle
solutions = Kanoodle3D.findAllSolutions(Pieces, 5, 5,5)
print(solutions)
