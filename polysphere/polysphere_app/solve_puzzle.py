def is_valid_position(board, piece, row, col):
    height = len(piece)
    width = len(piece[0])

    for i in range(height):
        for j in range(width):
            if piece[i][j] == ' ':
                continue

            if (
                row + i < 0 or col + j < 0 or
                row + i >= len(board) or col + j >= len(board[0]) or
                board[row + i][col + j] != ' '
            ):
                return False

    return True


def place_piece(board, piece, row, col, piece_id):
    height = len(piece)
    width = len(piece[0])

    for i in range(height):
        for j in range(width):
            if piece[i][j] != ' ':
                board[row + i][col + j] = piece_id


def remove_piece(board, piece, row, col):
    height = len(piece)
    width = len(piece[0])

    for i in range(height):
        for j in range(width):
            if piece[i][j] != ' ':
                board[row + i][col + j] = ' '


def solve_puzzle(pieces):
    def backtrack(board, piece_index):
        if piece_index == len(pieces):
            return board

        for row in range(len(board)):
            for col in range(len(board[0])):
                if is_valid_position(board, pieces[piece_index], row, col):
                    place_piece(board, pieces[piece_index], row, col, piece_index)
                    result = backtrack(board, piece_index + 1)
                    if result is not None:
                        return result
                    remove_piece(board, pieces[piece_index], row, col)

        return None

    # Initialize an empty board
    board = [[' ' for _ in range(11)] for _ in range(5)]

    # Convert the puzzle pieces to a list of 2D arrays
    pieces = [[list(row) for row in piece.split('\n')] for piece in pieces]

    return backtrack(board, 0)