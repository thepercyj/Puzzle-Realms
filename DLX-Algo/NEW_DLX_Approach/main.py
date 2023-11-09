# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:12:32 2023

@author: kadam
"""

import time
from datetime import datetime
from kanoodle import *

# Define grid dimensions
GridWidth = 3
GridHeight = 4

# Define the pieces
Pieces = [
            " A  \n"+
            " A  \n"+
            "AA  \n",

            # " B  \n"+
            # "BB  \n"+
            # "BB  \n",
            #
            # " C  \n"+
            # " C  \n"+
            # " C  \n"+
            # "CC  \n",
            #
            # " D  \n"+
            # " D  \n"+
            # "DD  \n"+
            # " D  \n",
            #
            # " E  \n"+
            # " E  \n"+
            # "EE  \n"+
            # "E   \n",

            "F   \n"+
            "FF  \n",

            "  G \n"+
            "  G \n"+
            "GGG \n",

            # "  H \n"+
            # " HH \n"+
            # "HH  \n",
            #
            # "I I \n"+
            # "III \n",
            #
            # "J   \n"+
            # "JJ  \n"+
            # "J   \n",
            #
            # " KK  \n"+
            # "KK  \n",
            #
            # " L  \n"+
            # "LL  \n"+
            # " LL \n"
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
        current_date = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
        filename = f'output_{current_date}.txt'
        print("The number of answers are", len(answer), "in", (start_time - end_time), "ms")
        for sol in answer:
            for ans in sol:
                print(ans)
            print("\n")
        # with open(filename, 'w') as file:
        #     for solution in answer:
        #         for row in solution:
        #             file.write(''.join(row) + '\n')
        #         file.write('\n')

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