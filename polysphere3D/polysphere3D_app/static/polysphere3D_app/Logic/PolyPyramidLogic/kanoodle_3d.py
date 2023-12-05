# -*- coding: utf-8 -*-
"""
Created on Tue Nov  7 19:11:51 2023

@author: kadam
"""

from enum import Enum
from typing import List, Set
from DLX import *
import re


class Kanoodle3D:
    @staticmethod
    def findAllSolutions(pieceDescriptions: List[str], gridWidth: int, gridHeight: int, gridDepth: int) -> str:
        pieces = Kanoodle3D.createPieces(pieceDescriptions, gridWidth, gridHeight, gridDepth)

        rows = Kanoodle3D.createSearchRows(pieces, gridWidth, gridHeight, gridDepth)
        solutions = DLX.solveAll(rows, gridWidth * gridHeight * gridDepth + len(pieces))
        if solutions:
            return Kanoodle3D.formatGrid(solutions, gridWidth, gridHeight, gridDepth)

        return "No solution found"

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


class Piece3D(Piece):
    def __init__(self, src: str, index: int, gridWidth: int, gridHeight: int, gridDepth: int):
        super().__init__(src, index, gridWidth, gridHeight)
        self.gridDepth = gridDepth
        self.dimensions = Tile3D(0, 0, 0)
        tiles = self.extractTiles3D(src, self.dimensions)
        self.bitfield = self.buildBitfield3D(tiles, self.dimensions)

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

    def getDepth(self, rotation=None):
        if rotation in [Rotation.ROTATION_90, Rotation.ROTATION_270]:
            return self.dimensions.col
        return self.dimensions.z

    def is_tile_at_3d(self, col, row, depth, rotation, flipped) -> bool:
        # Adapted is_tile_at for 3D
        flipped = bool(flipped)
        local_col = col
        local_row = row
        local_depth = depth
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
            if (0 != (self.bitfield & (1 << (local_depth * 8 * 8 + local_row * 8 + local_col)))):
                return True

        return False

    def get_signature_3d(self, rotation, flipped):
        # Adapted get_signature for 3D
        signature = 0
        for z in range(8):
            for r in range(8):
                for c in range(8):
                    if self.is_tile_at_3d(c, r, z, rotation, flipped):
                        signature |= 1 << (z * 8 * 8 + r * 8 + c)
        return signature


class Tile3D(Tile):
    def __init__(self, col, row, z):
        super().__init__(col, row)
        self.z = z


class SearchRow3D(SearchRow):
    def __init__(self, piece: Piece3D, rotation: Rotation, col: int, row: int, depth: int, flipped: bool):
        super().__init__(piece, rotation, col, row, flipped)
        self.depth = depth

    def is_tile_at(self, c, r):
        return self.piece.is_tile_at_3d(c - self.col, r - self.row, self.depth, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)
