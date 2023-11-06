from typing import List
import enum
import DLX
import math
import collections


class Rotation(enum.Enum):
    ROTATION_0 = 0
    ROTATION_90 = 90
    ROTATION_180 = 180
    ROTATION_270 = 270


class Tile:
    def __init__(self, col, row):
        self.col = col
        self.row = row


class Piece:
    def __init__(self, src, index, gridWidth, gridHeight):
        self.index = index
        self.source = src
        self.symbol = src.strip()[0]
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.dimensions = Tile(0, 0)
        tiles = self.extract_tiles(src, self.dimensions)
        self.bitfield = self.build_bitfield(tiles, self.dimensions)

    @staticmethod
    def build_bitfield(tiles, dimensions):
        assert dimensions.col <= 8
        assert dimensions.row <= 8
        bits = 0
        for t in tiles:
            bits |= 1 << (t.row * 8 + t.col)
        return bits

    @staticmethod
    def extract_tiles(src, max_tile):
        tiles = []
        col = 0
        row = 0
        for char in src:
            if char == '\n':
                col = 0
                row += 1
            elif not char.isspace():
                max_tile.col = max(max_tile.col, col + 1)
                max_tile.row = max(max_tile.row, row + 1)
                tiles.append(Tile(col, row))
                col += 1
            else:
                col += 1
        return tiles

    def get_width(self):
        return self.dimensions.col

    def get_height(self):
        return self.dimensions.row

    def get_width_rotation(self, rotation):
        if rotation == Rotation.ROTATION_0 or rotation == Rotation.ROTATION_180:
            return self.dimensions.col
        return self.dimensions.row

    def get_height_rotation(self, rotation):
        if rotation == Rotation.ROTATION_0 or rotation == Rotation.ROTATION_180:
            return self.dimensions.row
        return self.dimensions.col

    def is_tile_at(self, col, row, rotation, flipped):
        local_col = col
        local_row = row

        if rotation == Rotation.ROTATION_0:
            if flipped:
                local_col = self.get_width() - 1 - col
        elif rotation == Rotation.ROTATION_90:
            local_col = row
            local_row = self.get_height() - 1 - col
            if flipped:
                local_row = self.get_height() - 1 - local_row
        elif rotation == Rotation.ROTATION_180:
            if not flipped:
                local_col = self.get_width() - 1 - local_col
            local_row = self.get_height() - 1 - local_row
        elif rotation == Rotation.ROTATION_270:
            local_col = self.get_width() - 1 - row
            local_row = col
            if flipped:
                local_row = self.get_height() - 1 - local_row

        if 0 <= local_col < self.get_width() and 0 <= local_row < self.get_height():
            if 0 != (self.bitfield & (1 << (local_row * 8 + local_col))):
                return True
        return False

    def get_signature(self, rotation, flipped):
        signature = 0
        for r in range(8):
            for c in range(8):
                if self.is_tile_at(c, r, rotation, flipped):
                    signature |= 1 << (r * 8 + c)
        return signature


class SearchRow(DLX.RowSupplier) :
    def __init__(self, piece, rotation, col, row, flipped):
        self.piece = piece
        self.rotation = rotation
        self.col = col
        self.row = row
        self.flipped = flipped


def find_all_solutions(piece_descriptions, grid_width, grid_height):
    pieces = create_pieces(piece_descriptions, grid_width, grid_height)
    rows = create_search_rows(pieces, grid_width, grid_height)
    solutions = DLX.solveAll(rows, grid_width * grid_height + len(pieces))
    if solutions is not None:
        return format_grid(solutions, grid_width, grid_height)
    return "No solution found"


def create_pieces(piece_descriptions, grid_width, grid_height):
    pieces = []
    for i, description in enumerate(piece_descriptions):
        pieces.append(Piece(description, i, grid_width, grid_height))
    return pieces


def create_search_rows(pieces, grid_width, grid_height):
    rotations = list(Rotation)
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
                    max_col = grid_width - piece.get_width_rotation(rotation)
                    max_row = grid_height - piece.get_height_rotation(rotation)
                    for row in range(max_row + 1):
                        for col in range(max_col + 1):
                            rows.append(SearchRow(piece, rotation, col, row, flip))
    return rows


def format_grid(solutions, grid_width, grid_height):
    formatted_solutions = []
    for sol in solutions:
        grid = [[' ' for _ in range(grid_width)] for _ in range(grid_height)]
        for row in sol:
            h = row.piece.get_height_rotation(row.rotation)
            w = row.piece.get_width_rotation(row.rotation)
            for r in range(h):
                for c in range(w):
                    if row.piece.is_tile_at(c, r, row.rotation, row.flipped):
                        grid[row.row + r][row.col + c] = row.piece.symbol
        res = '\n' + '\n'.join([''.join(row) for row in grid]) + '\n'
        formatted_solutions.append(res)
    return ''.join(formatted_solutions)

