from django.db import models


# Create your models here.

class Rotation(models.Model):
    ROTATION_CHOICES = [
        (0, '0 degrees'),
        (90, '90 degrees'),
        (180, '180 degrees'),
        (270, '270 degrees'),
    ]

    degrees = models.IntegerField(choices=ROTATION_CHOICES)

    def __str__(self):
        return f'{self.degrees}'


class Tile(models.Model):
    col = models.IntegerField()
    row = models.IntegerField()

    def __str__(self):
        return f'Col: {self.col}, Row: {self.row}'


class Piece(models.Model):
    index = models.IntegerField()
    source = models.TextField()
    symbol = models.CharField(max_length=1)
    gridWidth = models.IntegerField()
    gridHeight = models.IntegerField()
    dimensions = models.ForeignKey(Tile, on_delete=models.CASCADE, related_name='pieces')

    def __str__(self):
        return f'Piece {self.index}'

    def getWidth(self, rotation=None):
        if rotation in [90, 270]:  # Use degrees directly
            return self.dimensions.row
        return self.dimensions.col

    def getHeight(self, rotation=None):
        if rotation in [90, 270]:  # Use degrees directly
            return self.dimensions.col
        return self.dimensions.row

    def is_tile_at(self, col, row, rotation, flipped):
        flipped = bool(flipped)
        local_col = col
        local_row = row
        if rotation == 0:
            if flipped is not None:
                local_col = self.dimensions.col - 1 - col
        elif rotation == 90:
            local_col = row
            local_row = self.dimensions.row - 1 - col
            if flipped is not None:
                local_row = self.dimensions.row - 1 - local_row
        elif rotation == 180:
            if flipped is None:
                local_col = self.dimensions.col - 1 - local_col
            local_row = self.dimensions.row - 1 - local_row
        elif rotation == 270:
            local_col = self.dimensions.col - 1 - row
            local_row = col
            if flipped is not None:
                local_row = self.dimensions.row - 1 - local_row

        if (
                0 <= local_col < self.dimensions.col
                and 0 <= local_row < self.dimensions.row
        ):
            if 0 != (self.bitfield & (1 << (local_row * 8 + local_col))):
                return True

        return False

    def get_signature(self, rotation, flipped):
        signature = 0
        for r in range(8):
            for c in range(8):
                if self.is_tile_at(c, r, rotation, flipped):
                    signature |= 1 << (r * 8 + c)

    def buildBitfield(self, tiles, dimensions):
        bits = 0
        for t in tiles:
            bits |= 1 << (t.row * 8 + t.col)
        return bits

    def extractTiles(self, src, maximum):
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

    def save(self, *args, **kwargs):
        self.dimensions = Tile(col=0, row=0)
        tiles = self.extractTiles(self.source, self.dimensions)
        self.bitfield = self.buildBitfield(tiles, self.dimensions)
        super().save(*args, **kwargs)

    pass


class SearchRow(models.Model):
    piece = models.ForeignKey(Piece, on_delete=models.CASCADE)
    rotation = models.IntegerField()  # Assuming Rotation is an IntegerEnum
    col = models.IntegerField()
    row = models.IntegerField()
    flipped = models.BooleanField()

    def is_tile_at(self, c, r):
        return self.piece.is_tile_at(c - self.col, r - self.row, self.rotation, self.flipped)

    def isColumnOccupied(self, col):
        if col >= self.piece.gridWidth * self.piece.gridHeight:
            return self.piece.index == col - (self.piece.gridWidth * self.piece.gridHeight)

        return self.is_tile_at(col % self.piece.gridWidth, col // self.piece.gridWidth)

    pass


class Solution(models.Model):
    # Define fields for Solution model (if needed)
    # ...
    pass
