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

    board = [[' ' for _ in range(11)] for _ in range(5)]
    pieces = [[list(row) for row in piece.split('\n')] for piece in pieces]

    return backtrack(board, 0)