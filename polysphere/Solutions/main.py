W, H = 11, 5


def parse_tiles(letters, tiles):
    return [
        [
            (x, y)
            for y, row in enumerate(tile)
            for x, cell in enumerate(row)
            if cell == letter
        ]
        for letter, tile in zip(letters, tiles)
    ]


def normalize(tile):
    dx = min(x for x, y in tile)
    dy = min(y for x, y in tile)
    return tuple(sorted((x - dx, y - dy) for x, y in tile))


def flip(tile):
    return [(y, x) for x, y in tile]


def rotate(tile, n_rotations):
    for _ in range(n_rotations):
        tile = [(y, -x) for x, y in tile]
    return tile


def all_rotations_and_flips(tile, optimize):
    # optimization: ignore rotated and flipped solutions
    # by removing rotations/flips of the first piece
    if optimize:
        return {normalize(rotate(tile, n)) for n in range(2)}
    return {
        normalize(rotate(flip, n))
        for flip in (tile, flip(tile))
        for n in range(4)
    }


def offset(tile, dx, dy):
    return [(x + dx, y + dy) for x, y in tile]


def generate_all_positions(tile, optimize):
    for tile in all_rotations_and_flips(tile, optimize):
        tile_w = max(x for x, y in tile)
        tile_h = max(y for x, y in tile)
        for dx in range(W - tile_w):
            for dy in range(H - tile_h):
                yield offset(tile, dx, dy)


def make_choices(letter, letters, tile):
    letter_cols = tuple(int(letter == c) for c in letters)
    for tile in generate_all_positions(tile, letter == 'A'):
        tile = [y * W + x for x, y in tile]
        tile_cols = tuple(int(index in tile) for index in range(W * H))
        yield letter_cols + tile_cols


def make_all_choices(letters, tiles):
    return [
        (letter, choice)
        for letter, tile in zip(letters, tiles)
        for choice in make_choices(letter, letters, tile)
    ]


def create_matrix():
    tiles = open("input.txt").read().split('\n\n')
    tiles = [tile.splitlines() for tile in tiles]
    letters = [tile[0].strip()[0] for tile in tiles]
    tiles = parse_tiles(letters, tiles)

    return make_all_choices(letters, tiles)


def min_num_ones(matrix, rows, columns):
    min_value = 10000
    for column in columns:
        num_ones = 0
        for row in rows:
            if matrix[row][column]:
                num_ones += 1
                if num_ones >= min_value:
                    break
        else:
            if num_ones <= 1:
                return column, num_ones
            if num_ones < min_value:
                min_column, min_value = column, num_ones
    return min_column, min_value


a = 0


def recurse(matrix, rows, columns, solutions, partial_solution):
    global a
    if not columns:
        a = a + 1
        print(a)
        solutions.append(partial_solution)
        return

    selected_col, min_value = min_num_ones(matrix, rows, columns)
    if min_value == 0:
        return

    candidate_rows = [row for row in rows if matrix[row][selected_col]]
    for candidate_row in candidate_rows:
        columns_to_remove = {column for column in columns if matrix[candidate_row][column]}
        rows_to_remove = {
            row
            for col in columns_to_remove
            for row in rows
            if matrix[row][col]
        }
        recurse(matrix, rows - rows_to_remove, columns - columns_to_remove, solutions,
                partial_solution + [candidate_row])


def print_solution(choices, solution):
    solution_rows = [choices[row] for row in solution]
    num_letters = len(choices[0][1]) - W * H
    flat_map = list(range(W * H))
    for letter, row in solution_rows:
        for i in range(W * H):
            if row[num_letters:][i]:
                flat_map[i] = letter
    for y in range(H):
        for x in range(W):
            print(flat_map[y * W + x], end='')
        print()
    print()


def write_solution_to_file(choices, solution, output_file):
    solution_rows = [choices[row] for row in solution]
    num_letters = len(choices[0][1]) - W * H
    flat_map = list(range(W * H))
    with open(output_file, 'a') as f:
        f.write('\n')
        for letter, row in solution_rows:
            for i in range(W * H):
                if row[num_letters:][i]:
                    flat_map[i] = letter
        for y in range(H):
            for x in range(W):
                f.write(flat_map[y * W + x])
            f.write('\n')


def main():
    choices = create_matrix()
    matrix = [row[1] for row in choices]

    rows = set(range(len(matrix)))
    columns = set(range(len(matrix[0])))

    solutions = []
    recurse(matrix, rows, columns, solutions, [])

    output_file = "solutions.txt"
    for solution in solutions:
        # print_solution(choices, solution)
        write_solution_to_file(choices, solution, output_file)


main()
