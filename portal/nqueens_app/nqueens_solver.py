def is_safe(board, row, col, n):
    """
    Check if it is safe to place a queen at the given position on the chessboard.

    Parameters:
    - board (list): The current state of the chessboard.
    - row (int): The row index of the position to check.
    - col (int): The column index of the position to check.
    - n (int): The size of the chessboard.

    Returns:
    - bool: True if it is safe to place a queen at the given position, False otherwise.
    """
    # Checking if there is a queen in the same column initializing variable "i" by using range function with argument
    # passed as column
    for i in range(col):
        if board[row][i] == 1:
            return False
    # Checking if there is a queen in the upper left diagonal initializing variable "i" and "j" and combining both
    # iterators with zip function and by using range function with argument passed as row and column respectively.
    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False
    # Checking if there is a queen in the upper right diagonal initializing variable "i" and "j" and combining both
    # iterators with zip function and by using range function with argument passed as row and column respectively.
    for i, j in zip(range(row, n, 1), range(col, -1, -1)):
        if board[i][j] == 1:
            return False

    return True


def solve_n_queens_util(board, col, n, solutions):
    """
    Recursive utility function to solve the N-Queens problem.

    Args:
        board (list[list[int]]): The current state of the chessboard.
        col (int): The current column being considered.
        n (int): The size of the chessboard.
        solutions (list[list[int]]): The list to store valid solutions.

    Returns:
        None
    """
    # If all queens are placed successfully and satisfy the three conditions, add the solution to the list of solutions
    if col >= n:
        solutions.append([row[:] for row in board])
        return
    # Try placing a queen in each row of the current column for conditional checks.
    for i in range(n):
        if is_safe(board, i, col, n):
            board[i][col] = 1
            solve_n_queens_util(board, col + 1, n, solutions)
            board[i][col] = 0


def solve_n_queens(n):
    """
    Solve the N-Queens problem and return a list of solutions.

    Parameters:
    n (int): The size of the chessboard and the number of queens.

    Returns:
    list: A list of solutions, where each solution is a 2D list representing the positions of the queens.
    """
    # Generate an empty board of size n x n to display the solutions.
    board = [[0 for _ in range(n)] for _ in range(n)]
    # Initializing a list to store solutions
    solutions = []
    # Start the solving process passing the arguments calculated from above functions.
    solve_n_queens_util(board, 0, n, solutions)

    return solutions
