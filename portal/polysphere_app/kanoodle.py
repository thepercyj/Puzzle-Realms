# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:11:51 2023

@author: kadam
"""

from enum import Enum
from typing import List, Set
from .DLX import *
import re


from typing import List, Set

class Kanoodle:
    """
    Kanoodle class represents a puzzle-solving game.

    Attributes:
        None

    Methods:
        findAllSolutions: Finds all solutions for the Kanoodle puzzle given the piece descriptions, grid width, and grid height.
        createPieces: Creates a list of Piece objects based on the piece descriptions, grid width, and grid height.
        createSearchRows: Creates a list of SearchRow objects based on the pieces, grid width, and grid height.
        formatGrid: Formats the solutions as a grid of strings.

    """

    @staticmethod
    def findAllSolutions(pieceDescriptions: List[str], gridWidth: int, gridHeight: int) -> str:
        """
        Finds all solutions for the Kanoodle puzzle.

        Args:
            pieceDescriptions: A list of strings representing the descriptions of the puzzle pieces.
            gridWidth: An integer representing the width of the puzzle grid.
            gridHeight: An integer representing the height of the puzzle grid.

        Returns:
            A string representing the formatted solutions of the puzzle, or "No solution found" if no solution is found.
        """
        pieces = Kanoodle.createPieces(pieceDescriptions, gridWidth, gridHeight)

        rows = Kanoodle.createSearchRows(pieces, gridWidth, gridHeight)
        solutions = DLX.solveAll(rows, gridWidth * gridHeight + len(pieces))
        if solutions:
            return Kanoodle.formatGrid(solutions, gridWidth, gridHeight)

        return "No solution found"

    @staticmethod
    def createPieces(pieceDescriptions: List[str], gridWidth: int, gridHeight: int) -> List['Piece']:
        """
        Creates a list of Piece objects based on the piece descriptions, grid width, and grid height.

        Args:
            pieceDescriptions: A list of strings representing the descriptions of the puzzle pieces.
            gridWidth: An integer representing the width of the puzzle grid.
            gridHeight: An integer representing the height of the puzzle grid.

        Returns:
            A list of Piece objects.
        """
        return [Piece(desc, i, gridWidth, gridHeight) for i, desc in enumerate(pieceDescriptions)]

    @staticmethod
    def createSearchRows(pieces: List['Piece'], gridWidth: int, gridHeight: int) -> List['SearchRow']:
        """
        Creates a list of SearchRow objects based on the pieces, grid width, and grid height.

        Args:
            pieces: A list of Piece objects representing the puzzle pieces.
            gridWidth: An integer representing the width of the puzzle grid.
            gridHeight: An integer representing the height of the puzzle grid.

        Returns:
            A list of SearchRow objects.
        """
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
    def formatGrid(solutions: List[List['SearchRow']], gridWidth: int, gridHeight: int) -> List[List[List[str]]]:
        """
        Formats the solutions as a grid of strings.

        Args:
            solutions: A list of lists of SearchRow objects representing the solutions.
            gridWidth: An integer representing the width of the puzzle grid.
            gridHeight: An integer representing the height of the puzzle grid.

        Returns:
            A list of lists of strings representing the formatted solutions.
        """
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


from enum import Enum

class Rotation(Enum):
    """
    Enum representing different rotation angles.
    
    Attributes:
        ROTATION_0 (int): Represents a rotation angle of 0 degrees.
        ROTATION_90 (int): Represents a rotation angle of 90 degrees.
        ROTATION_180 (int): Represents a rotation angle of 180 degrees.
        ROTATION_270 (int): Represents a rotation angle of 270 degrees.
    """
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
        """
        Initializes a Piece object.

        Args:
            src (str): The source string representing the piece.
            index (int): The index of the piece.
            gridWidth (int): The width of the grid.
            gridHeight (int): The height of the grid.
        """
        self.index = index
        self.source = src
        self.symbol = src.strip()[0]
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.dimensions = Tile(0, 0)
        tiles = self.extractTiles(src, self.dimensions)
        self.bitfield = self.buildBitfield(tiles, self.dimensions)

    ...

    def get_signature(self, rotation, flipped):
        """
        Calculates the signature of the piece based on its rotation and flipped status.

        Args:
            rotation: The rotation of the piece.
            flipped: The flipped status of the piece.

        Returns:
            int: The signature of the piece.
        """
        signature = 0
        for r in range(8):
            for c in range(8):
                if self.is_tile_at(c, r, rotation, flipped):
                    signature |= 1 << (r * 8 + c)
        return signature


class SearchRow(DLX.RowSupplier):
    def __init__(self, piece: Piece, rotation: Rotation, col: int, row: int, flipped: bool):
        """
        Initializes a SearchRow object.

        Args:
            piece (Piece): The piece associated with the row.
            rotation (Rotation): The rotation of the piece.
            col (int): The column position of the piece.
            row (int): The row position of the piece.
            flipped (bool): Indicates if the piece is flipped or not.
        """
        self.piece = piece
        self.rotation = rotation
        self.col = col
        self.row = row
        self.flipped = flipped

    def is_tile_at(self, c, r):
        """
        Checks if there is a tile at the specified column and row position.

        Args:
            c (int): The column position.
            r (int): The row position.

        Returns:
            bool: True if there is a tile at the specified position, False otherwise.
        """
        return self.piece.is_tile_at(c - self.col, r - self.row, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        """
        Checks if the specified column is occupied.

        Args:
            col (int): The column index.

        Returns:
            bool: True if the column is occupied, False otherwise.
        """
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)
