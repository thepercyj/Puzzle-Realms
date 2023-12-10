# This function checks if it's safe to place a queen at the specified position on the board.
def is_safe(board, row, col, n):
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


# This function recursively finds solutions to the N-Queens problem
def solve_n_queens_util(board, col, n, solutions):
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


# This is the main function that initiates the solving process for the above logic.
def solve_n_queens(n):
    # Generate an empty board of size n x n to display the solutions.
    board = [[0 for _ in range(n)] for _ in range(n)]
    # Initializing a list to store solutions
    solutions = []
    # Start the solving process passing the arguments calculated from above functions.
    solve_n_queens_util(board, 0, n, solutions)

    return solutions
