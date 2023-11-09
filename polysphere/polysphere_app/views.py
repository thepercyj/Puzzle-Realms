from django.shortcuts import render
from .models import Piece, SearchRow, Rotation


def solve_kanoodle(request):
    piece_descriptions = [
        # List of piece descriptions here
    ]
    grid_width = 11
    grid_height = 5

    pieces = Piece.createPieces(piece_descriptions, grid_width, grid_height)
    rows = SearchRow.createSearchRows(pieces, grid_width, grid_height)
    # DLX.solveAll is assumed to be a method from an external library that has not been provided.
    solutions = DLX.solveAll(rows, grid_width * grid_height + len(pieces))

    formatted_solutions = []

    if solutions:
        for sol in solutions:
            grid = [['' for _ in range(grid_width)] for _ in range(grid_height)]
            for row in sol:
                for r in range(row.piece.getHeight(row.rotation)):
                    for c in range(row.piece.getWidth(row.rotation)):
                        if row.piece.is_tile_at(c, r, row.rotation, row.flipped):
                            grid[row.row + r][row.col + c] = row.piece.symbol

            formatted_solutions.append(formatSingleGrid(grid))

        result = '\n\n'.join(formatted_solutions)
    else:
        result = "No solution found"

    context = {'result': result}
    return render(request, 'kanoodle/solution.html', context)
