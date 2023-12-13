# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:11:51 2023

@author: kadam
"""

from enum import Enum
from typing import List, Set
from .DLX import *
import re


class Kanoodle:
    @staticmethod
    def findAllSolutions(pieceDescriptions: List[str], gridWidth: int, gridHeight: int) -> str:
        pieces = Kanoodle.createPieces(pieceDescriptions, gridWidth, gridHeight)

        rows = Kanoodle.createSearchRows(pieces, gridWidth, gridHeight)
        solutions = DLX.solveAll(rows, gridWidth * gridHeight + len(pieces))
        if solutions:
            return Kanoodle.formatGrid(solutions, gridWidth, gridHeight)

        return "No solution found"

    @staticmethod
    def createPieces(pieceDescriptions: List[str], gridWidth: int, gridHeight: int) -> List['Piece']:
        return [Piece(desc, i, gridWidth, gridHeight) for i, desc in enumerate(pieceDescriptions)]

    @staticmethod
    def createSearchRows(pieces: List['Piece'], gridWidth: int, gridHeight: int) -> List['SearchRow']:
        rotations = list(Rotation)
        flipStates = [False, True]
        maxPiecePermutations = len(pieces) * len(rotations) * len(flipStates)
        rows = []
        pieceSignatures: Set[int] = set()

        for piece in pieces:
            for rotation in rotations:
                for flip in flipStates:
                    signature = piece.get_signature(rotation, flip)
                    if signature not in pieceSignatures:
                        pieceSignatures.add(signature)
                        maxCol = gridWidth - piece.getWidth(rotation)
                        maxRow = gridHeight - piece.getHeight(rotation)
                        for row in range(maxRow + 1):
                            for col in range(maxCol + 1):
                                rows.append(SearchRow(piece, rotation, col, row, flip))
        return rows

    @staticmethod
    # Your existing function
    def formatGrid(solutions: List[List['SearchRow']], gridWidth: int, gridHeight: int) -> List[List[List[str]]]:
        formattedSolutions = []

        # Define a helper function to format a single grid as a string
        def formatSingleGrid(grid):
            formatted = []
            for row in grid:
                formatted_row = ''.join(row)
                formatted.append(formatted_row)
            return '\n'.join(formatted)

        for sol in solutions:
            grid = [[' ' for _ in range(gridWidth)] for _ in range(gridHeight)]
            for row in sol:
                for r in range(row.piece.getHeight(row.rotation)):
                    for c in range(row.piece.getWidth(row.rotation)):
                        if row.piece.is_tile_at(c, r, row.rotation, row.flipped):
                            grid[row.row + r][row.col + c] = row.piece.symbol
            formattedSolutions.append(formatSingleGrid(grid))
        return '\n\n'.join(formattedSolutions)


class Rotation(Enum):
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


class Piece:
    def __init__(self, src: str, index: int, gridWidth: int, gridHeight: int):
        self.index = index
        self.source = src
        self.symbol = src.strip()[0]
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.dimensions = Tile(0, 0)
        tiles = self.extractTiles(src, self.dimensions)
        self.bitfield = self.buildBitfield(tiles, self.dimensions)

    @staticmethod
    def buildBitfield(tiles: List[Tile], dimensions: Tile) -> int:
        bits = 0
        for t in tiles:
            bits |= 1 << (t.row * 8 + t.col)
        return bits

    @staticmethod
    def extractTiles(src: str, maximum: Tile) -> List[Tile]:
        tiles = []
        col = 0
        row = 0
        for i, c in enumerate(src):
            if c == '\n':
                col = 0
                row += 1
            elif not c.isspace():
                maximum.col = max(maximum.col, col + 1)
                maximum.row = max(maximum.row, row + 1)
                tiles.append(Tile(col, row))
                col += 1
            else:
                col += 1
        return tiles

    def getWidth(self, rotation=None):
        if rotation in [Rotation.ROTATION_90, Rotation.ROTATION_270]:
            return self.dimensions.row
        return self.dimensions.col

    def getHeight(self, rotation=None):
        if rotation in [Rotation.ROTATION_90, Rotation.ROTATION_270]:
            return self.dimensions.col
        return self.dimensions.row

    def is_tile_at(self, col, row, rotation, flipped) -> bool:
        flipped = bool(flipped)
        local_col = col
        local_row = row
        if rotation == Rotation.ROTATION_0:
            if flipped is not None:
                local_col = self.getWidth() - 1 - col
        elif rotation == Rotation.ROTATION_90:
            local_col = row
            local_row = self.getHeight() - 1 - col
            if flipped is not None:
                local_row = self.getHeight() - 1 - local_row
        elif rotation == Rotation.ROTATION_180:
            if flipped is None:
                local_col = self.getWidth() - 1 - local_col
            local_row = self.getHeight() - 1 - local_row
        elif rotation == Rotation.ROTATION_270:
            local_col = self.getWidth() - 1 - row
            local_row = col
            if flipped is not None:
                local_row = self.getHeight() - 1 - local_row

        if local_col >= 0 and local_row >= 0 and local_col < self.getWidth() and local_row < self.getHeight():
            if (0 != (self.bitfield & (1 << (local_row * 8 + local_col)))):
                return True

        return False

    def get_signature(self, rotation, flipped):
        signature = 0
        for r in range(8):
            for c in range(8):
                if self.is_tile_at(c, r, rotation, flipped):
                    signature |= 1 << (r * 8 + c)
        return signature


class SearchRow(DLX.RowSupplier):
    def __init__(self, piece: Piece, rotation: Rotation, col: int, row: int, flipped: bool):
        self.piece = piece
        self.rotation = rotation
        self.col = col
        self.row = row
        self.flipped = flipped

    def is_tile_at(self, c, r):
        return self.piece.is_tile_at(c - self.col, r - self.row, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)
