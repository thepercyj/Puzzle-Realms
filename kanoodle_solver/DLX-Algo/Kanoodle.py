import dlx
from typing import List


class Kanoodle:
    @staticmethod
    def findAllSolutions(pieceDescriptions, gridWidth, gridHeight):
        pieces = Kanoodle.createPieces(pieceDescriptions, gridWidth, gridHeight)
        rows = Kanoodle.createSearchRows(pieces, gridWidth, gridHeight)
        solutions = dlx.DLX(rows, gridWidth * gridHeight + len(pieces))
        if solutions is not None:
            return Kanoodle.formatGrid(solutions, gridWidth, gridHeight)
        return "No solution found"

    @staticmethod
    def createPieces(pieceDescriptions, gridWidth, gridHeight):
        pieces = []
        for i in range(len(pieceDescriptions)):
            pieces.append(Kanoodle.Piece(pieceDescriptions[i], i, gridWidth, gridHeight))
        return pieces

    class Rotation:
        ROTATION_0 = 0
        ROTATION_90 = 1
        ROTATION_180 = 2
        ROTATION_270 = 3

        @classmethod
        def __iter__(cls):
            return iter([cls.ROTATION_0, cls.ROTATION_90, cls.ROTATION_180, cls.ROTATION_270])

    class Tile:
        def __init__(self, col, row):
            self.col = col
            self.row = row

        @classmethod
        def __iter__(cls):
            return iter([])  # Define the way you want to iterate through Tile objects

    class SearchRow:
        def __init__(self, piece, rotation, col, row, flipped):
            self.piece = piece
            self.rotation = rotation
            self.col = col
            self.row = row
            self.flipped = flipped

        def isTileAt(self, c, r):
            return self.piece.isTileAt(c - self.col, r - self.row, self.rotation, self.flipped)

        def isColumnOccupied(self, col):
            if col >= (self.piece.gridWidth * self.piece.gridHeight):
                return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)
            return self.isTileAt(col % self.piece.gridWidth, col // self.piece.gridWidth)

    @staticmethod
    def createSearchRows(pieces, gridWidth, gridHeight) -> List[SearchRow]:
        rotations = [value for name, value in Kanoodle.Rotation.__dict__.items() if
                     not name.startswith("__")]  # Access the Rotation class
        flipStates = [False, True]
        maxPiecePermutations = len(pieces) * len(rotations) * len(flipStates)
        rows = [] * (maxPiecePermutations * gridWidth * gridHeight)
        pieceSignatures = set()
        for piece in pieces:
            for rotation in rotations:
                for flip in flipStates:
                    signature = piece.getSignature(rotation, flip)
                    if signature not in pieceSignatures:
                        pieceSignatures.add(signature)
                        maxCol = gridWidth - piece.getWidth(rotation)
                        maxRow = gridHeight - piece.getHeight(rotation)
                        for row in range(maxRow + 1):
                            for col in range(maxCol + 1):
                                rows.append(Kanoodle.SearchRow(piece, rotation, col, row, flip))
        return rows

    @staticmethod
    def formatGrid(solutions, gridWidth, gridHeight):
        formattedSolutions = []
        for sol in solutions:
            grid = [[' ' for _ in range(gridWidth)] for _ in range(gridHeight)]
            for row in sol:
                h = row.piece.getHeight(row.rotation)
                w = row.piece.getWidth(row.rotation)
                for r in range(h):
                    for c in range(w):
                        if row.piece.isTileAt(c, r, row.rotation, row.flipped):
                            grid[row.row + r][row.col + c] = row.piece.symbol
            res = '\n'
            for r in range(gridHeight):
                res += ''.join(grid[r]) + '\n'
            formattedSolutions.append(res)
        return formattedSolutions

    @staticmethod
    def buildBitfield(tiles, dimensions):
        assert dimensions.col <= 8
        assert dimensions.row <= 8
        bits = 0
        for t in tiles:
            bits |= 1 << (t.row * 8 + t.col)
        return bits

    @staticmethod
    def extractTiles(src, dimensions):
        tiles = []
        col = 0
        row = 0
        for c in src:
            if c == '\n':
                col = 0
                row += 1
            elif not c.isspace():
                dimensions.col = max(dimensions.col, col + 1)  # Corrected line
                dimensions.row = max(dimensions.row, row + 1)  # Corrected line
                tile = Kanoodle.Tile(col, row)
                tiles.append(tile)
                col += 1
        return tiles

    class Piece:

        def __init__(self, src, index, gridWidth, gridHeight):
            self.index = index
            self.source = src
            self.symbol = src.strip()[0]
            self.gridWidth = gridWidth
            self.gridHeight = gridHeight
            self.dimensions = Kanoodle.Tile(0, 0)
            tiles = Kanoodle.extractTiles(src, self.dimensions)
            self.bitfield = Kanoodle.buildBitfield(tiles, self.dimensions)

        def getWidth(self, r=None):
            if r is None:
                return self.dimensions.col
            elif r == Kanoodle.Rotation.ROTATION_0 or r == Kanoodle.Rotation.ROTATION_180:
                return self.dimensions.col
            else:
                return self.dimensions.row

        def getHeight(self, r=None):
            if r is None:
                return self.dimensions.row
            elif r == Kanoodle.Rotation.ROTATION_0 or r == Kanoodle.Rotation.ROTATION_180:
                return self.dimensions.row
            else:
                return self.dimensions.col

        def isTileAt(self, col, row, rotation, flipped):
            localCol = col
            localRow = row
            if rotation == Kanoodle.Rotation.ROTATION_0:
                if flipped:
                    localCol = self.getWidth() - 1 - col
            elif rotation == Kanoodle.Rotation.ROTATION_90:
                localCol = row
                localRow = self.getHeight() - 1 - col
                if flipped:
                    localRow = self.getHeight() - 1 - localRow
            elif rotation == Kanoodle.Rotation.ROTATION_180:
                if not flipped:
                    localCol = self.getWidth() - 1 - localCol
                localRow = self.getHeight() - 1 - localRow
            elif rotation == Kanoodle.Rotation.ROTATION_270:
                localCol = self.getWidth() - 1 - row
                localRow = col
                if flipped:
                    localRow = self.getHeight() - 1 - localRow
            if 0 <= localCol < self.getWidth() and 0 <= localRow < self.getHeight():
                if 0 != (self.bitfield & (1 << (localRow * 8 + localCol))):
                    return True
            return False

        def getSignature(self, rotation, flipped):
            signature = 0
            for r in range(8):
                for c in range(8):
                    if self.isTileAt(c, r, rotation, flipped):
                        signature |= 1 << (r * 8 + c)
            return signature
