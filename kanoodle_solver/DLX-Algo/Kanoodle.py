from DLX import *


class Kanoodle:
    @staticmethod
    def find_all_solutions(piece_descriptions, grid_width, grid_height):
        pieces = Kanoodle.create_pieces(piece_descriptions, grid_width, grid_height)
        rows = Kanoodle.create_search_rows(pieces, grid_width, grid_height)
        solutions = DLX.solve_all(rows, grid_width * grid_height + len(pieces))
        if solutions:
            return Kanoodle.format_grid(solutions, grid_width, grid_height)
        return "No solution found"

    @staticmethod
    def create_pieces(piece_descriptions, grid_width, grid_height):
        pieces = []
        for i, description in enumerate(piece_descriptions):
            pieces.append(Kanoodle.Piece(description, i, grid_width, grid_height))
        return pieces

    @staticmethod
    def create_search_rows(pieces, grid_width, grid_height):
        rotations = [Kanoodle.Rotation.ROTATION_0, Kanoodle.Rotation.ROTATION_90,
                     Kanoodle.Rotation.ROTATION_180, Kanoodle.Rotation.ROTATION_270]
        flip_states = [False, True]
        max_piece_permutations = len(pieces) * len(rotations) * len(flip_states)
        rows = []

        piece_signatures = set()

        for piece in pieces:
            for rotation in rotations:
                for flip in flip_states:
                    signature = piece.get_signature(rotation, flip)

                    if signature not in piece_signatures:
                        piece_signatures.add(signature)
                        max_col = grid_width - piece.get_width(rotation)
                        max_row = grid_height - piece.get_height(rotation)

                        for row in range(max_row + 1):
                            for col in range(max_col + 1):
                                rows.append(Kanoodle.SearchRow(piece, rotation, col, row, flip))

        return rows

    @staticmethod
    def format_grid(solutions, grid_width, grid_height):
        formatted_solutions = []

        for solution in solutions:
            grid = [[' ' for _ in range(grid_width)] for _ in range(grid_height)]

            for row in solution:
                h = row.piece.get_height(row.rotation)
                w = row.piece.get_width(row.rotation)

                for r in range(h):
                    for c in range(w):
                        if row.piece.is_tile_at(c, r, row.rotation, row.flipped):
                            grid[row.row + r][row.col + c] = row.piece.symbol

            res = '\n' + '\n'.join([''.join(row) for row in grid])
            formatted_solutions.append(res)

        return formatted_solutions

    class Rotation:
        ROTATION_0 = 0
        ROTATION_90 = 1
        ROTATION_180 = 2
        ROTATION_270 = 3

    class Tile:
        def __init__(self, col, row):
            self.col = col
            self.row = row

    class Piece:
        def __init__(self, src, index, grid_width, grid_height):
            self.index = index
            self.source = src
            self.symbol = src.lstrip()[0]
            self.grid_width = grid_width
            self.grid_height = grid_height
            self.dimensions = Kanoodle.Tile(0, 0)
            tiles = self.extract_tiles(src, self.dimensions)
            self.bitfield = self.build_bitfield(tiles, self.dimensions)

        @staticmethod
        def extract_tiles(src, max_dimensions):
            tiles = []
            col = 0
            row = 0
            for i in range(len(src)):
                c = src[i]
                if c == '\n':
                    col = 0
                    row += 1
                elif not c.isspace():
                    max_dimensions.col = max(col + 1, max_dimensions.col)
                    max_dimensions.row = max(row + 1, max_dimensions.row)
                    tiles.append(Kanoodle.Tile(col, row))
                    col += 1
                else:
                    col += 1
            return tiles

        @staticmethod
        def build_bitfield(tiles, dimensions):
            assert dimensions.col <= 8
            assert dimensions.row <= 8
            bits = 0
            for t in tiles:
                bits |= 1 << (t.row * 8 + t.col)
            return bits

        def get_width(self, rotation=None):
            if rotation is None or rotation == Kanoodle.Rotation.ROTATION_0 or rotation == Kanoodle.Rotation.ROTATION_180:
                return self.dimensions.col
            return self.dimensions.row

        def get_height(self, rotation=None):
            if rotation is None or rotation == Kanoodle.Rotation.ROTATION_0 or rotation == Kanoodle.Rotation.ROTATION_180:
                return self.dimensions.row
            return self.dimensions.col

        def is_tile_at(self, col, row, rotation=None, flipped=False):
            local_col = col
            local_row = row

            if rotation == Kanoodle.Rotation.ROTATION_0:
                if flipped:
                    local_col = self.get_width() - 1 - col
            elif rotation == Kanoodle.Rotation.ROTATION_90:
                local_col = row
                local_row = self.get_height() - 1 - col
                if flipped:
                    local_row = self.get_height() - 1 - local_row
            elif rotation == Kanoodle.Rotation.ROTATION_180:
                if not flipped:
                    local_col = self.get_width() - 1 - local_col
                local_row = self.get_height() - 1 - local_row
            elif rotation == Kanoodle.Rotation.ROTATION_270:
                local_col = self.get_width() - 1 - row
                local_row = col
                if flipped:
                    local_row = self.get_height() - 1 - local_row

            if 0 <= local_col < self.get_width() and 0 <= local_row < self.get_height():
                return (self.bitfield & (1 << (local_row * 8 + local_col))) != 0
            return False

        def get_signature(self, rotation, flipped):
            signature = 0
            for r in range(8):
                for c in range(8):
                    if self.is_tile_at(c, r, rotation, flipped):
                        signature |= 1 << (r * 8 + c)
            return signature

    class SearchRow(DLX.RowSupplier):
        def __init__(self, piece, rotation, col, row, flipped):
            self.piece = piece
            self.rotation = rotation
            self.col = col
            self.row = row
            self.flipped = flipped

        def is_tile_at(self, c, r):
            return self.piece.is_tile_at(c - self.col, r - self.row, self.rotation, self.flipped)

        def is_column_occupied(self, col):
            if col >= (self.piece.grid_width * self.piece.grid_height):
                return self.piece.index == col - (self.piece.grid_width * self.piece.grid_height)
            return self.is_tile_at(col % self.piece.grid_width, col // self.piece.grid_width)
