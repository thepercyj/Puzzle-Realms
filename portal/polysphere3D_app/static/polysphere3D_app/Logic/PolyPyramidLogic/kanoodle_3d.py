# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:11:51 2023

@author: kadam
"""

from enum import Enum, auto
from typing import List, Set
from DLX import *
import re


class Kanoodle3D:
    @staticmethod
    def findAllSolutions(pieceDescriptions: List[str], gridWidth: int, gridHeight: int, gridDepth: int) -> str:
        pieces = [Piece3D(desc, i, gridWidth, gridHeight, gridDepth) for i, desc in enumerate(pieceDescriptions)]
        rows = []
        for piece in pieces:
            for rotation in list(Rotation):
                for flip in [False, True]:
                    signature = piece.get_signature_3d(rotation, flip)
                    for row in range(gridHeight - piece.getHeight(rotation) + 1):
                        for col in range(gridWidth - piece.getWidth(rotation) + 1):
                            for depth in range(gridDepth - piece.getDepth(rotation) + 1):
                                rows.append(SearchRow3D(piece, rotation, col, row, depth, flip))
        solutions = DLX.solveAll(rows, gridWidth * gridHeight * gridDepth + len(pieces))
        return "Formatted Solutions" if solutions else "No solution found"

    @staticmethod
    def createPieces(pieceDescriptions: List[str], gridWidth: int, gridHeight: int, gridDepth: int) -> List['Piece3D']:
        return [Piece3D(desc, i, gridWidth, gridHeight, gridDepth) for i, desc in enumerate(pieceDescriptions)]

    @staticmethod
    def createSearchRows(pieces: List['Piece3D'], gridWidth: int, gridHeight: int, gridDepth: int) -> List[
        'SearchRow3D']:
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
                        maxDepth = gridDepth - piece.getDepth(rotation)
                        for row in range(maxRow + 1):
                            for col in range(maxCol + 1):
                                for depth in range(maxDepth + 1):
                                    rows.append(SearchRow3D(piece, rotation, col, row, depth, flip))
        return rows

    @staticmethod
    def formatGrid(solutions: List[List['SearchRow3D']], gridWidth: int, gridHeight: int, gridDepth: int) -> List[
        List[List[str]]]:
        # Existing formatting logic remains the same, adjust if needed
        pass

class Rotation(Enum):
    ROTATION_X_0 = auto()
    ROTATION_X_90 = auto()
    ROTATION_X_180 = auto()
    ROTATION_X_270 = auto()
    ROTATION_Y_0 = auto()
    ROTATION_Y_90 = auto()
    ROTATION_Y_180 = auto()
    ROTATION_Y_270 = auto()
    ROTATION_Z_0 = auto()
    ROTATION_Z_90 = auto()
    ROTATION_Z_180 = auto()
    ROTATION_Z_270 = auto()


class Tile:
    def __init__(self, col, row):
        self.col = col
        self.row = row


class Tile3D:
    def __init__(self, col, row, z):
        self.col = col
        self.row = row
        self.z = z


class Piece3D:
    def __init__(self, src: str, index: int, gridWidth: int, gridHeight: int, gridDepth: int):
        self.index = index
        self.source = src
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.gridDepth = gridDepth
        self.dimensions = Tile3D(0, 0, 0)
        self.layout = self.extractTiles3D(src, self.dimensions)

    def buildBitfield3D(self, tiles: List[Tile3D], dimensions: Tile3D) -> int:
        # Adapted bitfield creation for 3D
        bits = 0
        for t in tiles:
            bits |= 1 << (t.z * 8 * 8 + t.row * 8 + t.col)
        return bits

    def extractTiles3D(self, src: str, maximum: Tile3D) -> List[Tile3D]:
        # Adapted tile extraction for 3D
        tiles = []
        col = 0
        row = 0
        depth = 0
        for i, c in enumerate(src):
            if c == '\n':
                col = 0
                row += 1
                if row == self.gridHeight:
                    depth += 1
                    row = 0
            elif not c.isspace():
                maximum.col = max(maximum.col, col + 1)
                maximum.row = max(maximum.row, row + 1)
                maximum.z = max(maximum.z, depth + 1)
                tiles.append(Tile3D(col, row, depth))
                col += 1
            else:
                col += 1
        return tiles

    def getHeight(self, rotation):
        # Logic to calculate the height based on rotation
        # This is a simplistic example and should be adapted to your specific case
        if rotation in [Rotation.ROTATION_X_0, Rotation.ROTATION_X_180]:
            return self.dimensions.row
        elif rotation in [Rotation.ROTATION_Y_90, Rotation.ROTATION_Y_270]:
            return self.dimensions.col
        else:
            return self.dimensions.z

    def getWidth(self, rotation):
        # Logic to calculate the width based on rotation
        if rotation in [Rotation.ROTATION_X_90, Rotation.ROTATION_X_270]:
            return self.dimensions.z
        elif rotation in [Rotation.ROTATION_Y_0, Rotation.ROTATION_Y_180]:
            return self.dimensions.col
        else:
            return self.dimensions.row

    def getDepth(self, rotation):
        # Logic to calculate the depth based on rotation
        if rotation in [Rotation.ROTATION_X_0, Rotation.ROTATION_X_180]:
            return self.dimensions.z
        elif rotation in [Rotation.ROTATION_Y_90, Rotation.ROTATION_Y_270]:
            return self.dimensions.row
        else:
            return self.dimensions.col

    def is_tile_at_3d(self, col, row, depth, rotation, flipped) -> bool:
        # Adapted is_tile_at for 3D
        for tile in self.layout:
            transformed_tile = self.transform_tile(tile, rotation, flipped)
            if transformed_tile == (col, row, depth):
                return True
        return False

    def transform_tile(self, tile, rotation, flipped):
        x, y, z = tile.col, tile.row, tile.z

        # Apply rotation
        if rotation == Rotation.ROTATION_X_90:
            x, y, z = x, -z, y
        elif rotation == Rotation.ROTATION_X_180:
            x, y, z = x, -y, -z
        elif rotation == Rotation.ROTATION_X_270:
            x, y, z = x, z, -y
        elif rotation == Rotation.ROTATION_Y_90:
            x, y, z = z, y, -x
        elif rotation == Rotation.ROTATION_Y_180:
            x, y, z = -x, y, -z
        elif rotation == Rotation.ROTATION_Y_270:
            x, y, z = -z, y, x
        elif rotation == Rotation.ROTATION_Z_90:
            x, y, z = -y, x, z
        elif rotation == Rotation.ROTATION_Z_180:
            x, y, z = -x, -y, z
        elif rotation == Rotation.ROTATION_Z_270:
            x, y, z = y, -x, z

        # Apply flipping
        if flipped:
            x, y, z = -x, -y, -z  # Example flipping logic, adjust as needed

        return x, y, z

    def get_signature_3d(self, rotation, flipped):
        # Adapted get_signature for 3D
        signature = 0
        for z in range(8):
            for r in range(8):
                for c in range(8):
                    if self.is_tile_at_3d(c, r, z, rotation, flipped):
                        signature |= 1 << (z * 8 * 8 + r * 8 + c)
        return signature

    def rotate_x(self):
        """Rotate the piece around the X-axis by 90 degrees."""
        new_layout = []
        for (x, y, z) in self.layout:
            new_layout.append((x, -z, y))  # Swap Y and Z and negate Z
        self.layout = new_layout

    def rotate_y(self):
        """Rotate the piece around the Y-axis by 90 degrees."""
        new_layout = []
        for (x, y, z) in self.layout:
            new_layout.append((z, y, -x))  # Swap X and Z and negate X
        self.layout = new_layout

    def rotate_z(self):
        """Rotate the piece around the Z-axis by 90 degrees."""
        new_layout = []
        for (x, y, z) in self.layout:
            new_layout.append((-y, x, z))  # Swap X and Y and negate Y
        self.layout = new_layout


    def is_tile_at(self, c, r):
        return self.piece.is_tile_at(c - self.col, r - self.row, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)


class SearchRow3D:
    def __init__(self, piece: Piece3D, rotation: Rotation, col: int, row: int, depth: int, flipped: bool):
        self.piece = piece
        self.rotation = rotation
        self.col = col
        self.row = row
        self.depth = depth
        self.flipped = flipped

    def is_tile_at(self, c, r):
        return self.piece.is_tile_at_3d(c - self.col, r - self.row, self.depth, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)

    def get_z_dimension(self):
        # You need to define how the depth of the piece is determined.
        # This is just a placeholder implementation. You'll need to adjust it
        # based on how your pieces are defined and how their depth changes in 3D space.
        return self.piece.getDepth(self.rotation)
