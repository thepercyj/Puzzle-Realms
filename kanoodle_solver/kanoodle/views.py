from django.shortcuts import render

# Create your views here.
from .DLX import DLX


def find_solution(request):
    GridWidth = 11
    GridHeight = 5

    Pieces = [
        " A  \n"
        " A  \n"
        "AA  \n",

        " B  \n"
        "BB  \n"
        "BB  \n",

        " C  \n"
        " C  \n"
        " C  \n"
        "CC  \n",

        " D  \n"
        " D  \n"
        "DD  \n"
        " D  \n",

        " E  \n"
        " E  \n"
        "EE  \n"
        "E   \n",

        "F   \n"
        "FF  \n",

        "  G \n"
        "  G \n"
        "GGG \n",

        "  H \n"
        " HH \n"
        "HH  \n",

        "I I \n"
        "III \n",

        "J   \n"
        "J   \n"
        "J   \n"
        "J   \n",

        "KK  \n"
        "KK  \n",

        " L  \n"
        "LLL \n"
        " L  \n"
    ]

    solutions = generate_solutions(GridWidth, GridHeight, Pieces)
    formatted_solutions = []

    for solution in solutions:
        formatted_solution = convert_solution_to_string(solution, Pieces, GridWidth, GridHeight)
        formatted_solutions.append(formatted_solution)

    context = {'solutions': formatted_solutions}
    return render(request, 'kanoodle/solution.html', context)


def convert_solution_to_string(solution, Pieces, GridWidth, GridHeight):
    formatted_solution = ""
    for node in solution:
        if isinstance(node, DLX.Data):
            col = node.column
            row = node.row
            value = node.value
            piece = Pieces[value - GridWidth * GridHeight]
            lines = piece.split('\n')[:-1]
            for line in lines:
                formatted_solution += line + '\n'
    return formatted_solution


def generate_solutions(GridWidth, GridHeight, Pieces):
    dlx = DLX(GridWidth * GridHeight + len(Pieces))

    # Generate DLX constraints based on Pieces, GridWidth, and GridHeight
    for idx, piece in enumerate(Pieces):
        lines = piece.strip().split('\n')
        for r, line in enumerate(lines):
            for c, char in enumerate(line):
                if char != ' ':
                    col = r * GridWidth + c
                    value = GridWidth * GridHeight + idx
                    data = dlx.Data()  # Create a new Data object
                    data.row = r
                    data.column = dlx.header[col]
                    data.up = dlx.header[col].up
                    data.down = dlx.header[col]
                    dlx.header[col].up.down = data
                    dlx.header[col].up = data
                    dlx.header[col].size += 1
                    data.value = value  # Assign the value to the Data object
                    dlx.rows[r][col] = data  # Assign the Data object to the corresponding position

    return dlx.search()
