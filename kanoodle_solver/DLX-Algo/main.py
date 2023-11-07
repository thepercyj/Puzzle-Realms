# Import the DLX class from your provided code.
from dlx import DLX

# Define the Kanoodle problem parameters.
GridWidth = 11
GridHeight = 5

Pieces = [
    " A  \n" +
    " A  \n" +
    "AA  \n",

    " B  \n" +
    "BB  \n" +
    "BB  \n",

    " C  \n" +
    " C  \n" +
    " C  \n" +
    "CC  \n",

    " D  \n" +
    " D  \n" +
    "DD  \n" +
    " D  \n",

    " E  \n" +
    " E  \n" +
    "EE  \n" +
    "E   \n",

    "F   \n" +
    "FF  \n",

    "  G \n" +
    "  G \n" +
    "GGG \n",

    "  H \n" +
    " HH \n" +
    "HH  \n",

    "I I \n" +
    "III \n",

    "J   \n" +
    "JJ  \n" +
    "J   \n",

    " KK  \n" +
    "KK  \n",

    " L  \n" +
    "LL  \n" +
    " LL \n"
]


# Define a function to convert the Kanoodle input into DLX rows.
def convert_kanoodle_input(GridWidth, GridHeight, Pieces):
    rows = []
    for piece_idx, piece in enumerate(Pieces):
        piece_lines = piece.split('\n')
        piece_rows = len(piece_lines)
        piece_cols = max(len(line) for line in piece_lines)

        # Try all possible positions for this piece on the board.
        for row in range(GridHeight - piece_rows + 1):
            for col in range(GridWidth - piece_cols + 1):
                dlx_row = [f'{piece_idx}-{r}-{c}' for r in range(piece_rows) for c in range(piece_cols) if
                           c < len(piece_lines[r]) and piece_lines[r][c] == ' ']
                rows.append(dlx_row)
    return rows


# Convert the Kanoodle input into DLX rows.
kanoodle_rows = convert_kanoodle_input(GridWidth, GridHeight, Pieces)

# Define column names and types.
column_names = [(f'{i}-{r}-{c}', DLX.PRIMARY) for i in range(len(Pieces)) for r in range(GridHeight) for c in
                range(GridWidth)]
column_names.append(('Piece', DLX.PRIMARY))  # Column for selecting a piece.

# Create a DLX instance with columns and rows.
dlx = DLX(column_names)
dlx.appendRows(kanoodle_rows)
print(kanoodle_rows)

# Define a function to check if a row corresponds to a valid piece placement.
def is_valid_placement(row):
    piece_indices = set()
    for entry in row:
        piece_idx = int(entry.split('-')[0])
        if piece_idx in piece_indices:
            return False
        piece_indices.add(piece_idx)

    return True


# Function to validate and print the solution.
def validate_and_print_solution(solution):
    valid_solution = all(is_valid_placement(row) for row in solution)
    if valid_solution:
        print("Valid Solution:")
        for row in solution:
            print(row)
    else:
        print("Invalid Solution")


# Solve the Kanoodle problem.
for dlx_solution in dlx.solve():
    validate_and_print_solution(dlx_solution)
