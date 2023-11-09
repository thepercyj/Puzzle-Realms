# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:12:32 2023

@author: kadam
"""

import time
from kanoodle import *

# Define grid dimensions
GridWidth = 11
GridHeight = 5

# Define the pieces
Pieces = [
            " A  \n"+
            " A  \n"+
            "AA  \n",

            " B  \n"+
            "BB  \n"+
            "BB  \n",

            " C  \n"+
            " C  \n"+
            " C  \n"+
            "CC  \n",

            " D  \n"+
            " D  \n"+
            "DD  \n"+
            " D  \n",

            " E  \n"+
            " E  \n"+
            "EE  \n"+
            "E   \n",

            "F   \n"+
            "FF  \n",

            "  G \n"+
            "  G \n"+
            "GGG \n",

            "  H \n"+
            " HH \n"+
            "HH  \n",

            "I I \n"+
            "III \n",

            "J   \n"+
            "J   \n"+
            "J   \n"+
            "J   \n",

            "KK  \n"+
            "KK  \n",

            " L  \n"+
            "LLL \n"+
            " L  \n"
    ]

def main():
    start_time = time.time()

    # Initialize the board with 2 pieces
    # initial_board = [[' ' for _ in range(GridWidth)] for _ in range(GridHeight)]

    # Initialize the board with empty spaces
    #initial_board = [[' ' for j in range(GridWidth)] for i in range(GridHeight)]
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
        print("Found answer:\n", len(answer), "\n in", end_time - start_time, "ms" )

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

if __name__ == "__main__":
    main()