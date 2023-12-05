# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:12:32 2023

@author: kadam
"""

import time
from datetime import datetime
from kanoodle_3d import *

# Define pyramid levels dimensions
pyramidLevels = 5

# Define grid dimensions
GridWidth = 11
GridHeight = 5


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


def main():
    start_time = time.time()

    # Initialize the board with 2 pieces
    # initial_board = [[' ' for _ in range(GridWidth)] for _ in range(GridHeight)]

    # Initialize the board with empty spaces
    # initial_board = [[' ' for j in range(GridWidth)] for i in range(GridHeight)]
    # initialize_board(initial_board)   # Convert the board to a string format
    # print("This is initial_board", initial_board)

    # board_description = ""
    # for i in range(GridHeight):
    #     for j in range(GridWidth):
    #         board_description += initial_board[i][j]
    #     board_description += "\n"
    # print("This is pieces", Pieces)
    # print("This is board Desc", board_description)
    #
    # # Add the board description to the list of pieces
    # modified_pieces = Pieces + [board_description]
    # print("This is modified_pieces0", modified_pieces)

    # Use the modified_pieces array to find solutions
    # This assumes the existence of a Kanoodle class with a findAllSolutions method, which is not provided.
    answer = Kanoodle.findAllSolutions(Pieces, GridWidth, GridHeight)
    end_time = time.time()

    if answer:
        current_date = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f'output_{current_date}.txt'

        with open(filename, 'w') as file:
            for index, solution in enumerate(answer):
                print("Processing solution No.", index)
                sol = reversed(solution)  # Reversing each solution over the X axis
                for row in sol:
                    file.write(''.join(row) + '\n')
                    print(row)
                file.write('\n')


# def initialize_board(board):
#     # Example: Place piece I at (0, 0) and piece I at (0, 2)
#     # Initialize the board with empty spaces already handled in the main function
#
#     board[0][0] = 'J'
#     board[0][1] = 'J'
#     board[1][0] = 'J'
#     board[2][0] = 'J'
#     board[2][1] = 'J'
#
#     board[0][2] = 'L'
#     board[1][1] = 'L'
#     board[1][2] = 'L'
#     board[2][2] = 'L'
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
            row_array = ['X' for _ in range(level)]
            level_array.append(row_array)

        pyramid_representation.append(level_array)

    return pyramid_representation


# Generating the pyramid board representation
board_representation = generate_pyramid_board_representation(pyramidLevels)

level_num = 1
for level in board_representation:
    print(f"Level {level_num}: {level}")
    level_num += 1

if __name__ == "__main__":
    main()
