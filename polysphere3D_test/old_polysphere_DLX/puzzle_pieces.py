import os
class Piece3D:
    def __init__(self, shape, grid_2d ):
        self.shape = shape
        self.blocks = self._convert_grid_to_3d(grid_2d)
        self.rotation = [0,0,0] # Represents rotation around x,y and z axes

    pieces_data = {
        'A': {
            'shape': 'A',
            'grid': [
                " A  ",
                " A  ",
                "AA  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/A-min.webp",
            'rotation': 0
        },
        'B': {
            'shape': 'B',
            'grid': [
                " B  ",
                "BB  ",
                "BB  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/B-min.webp",
            'rotation': 0
        },
        'C': {
            'shape': 'C',
            'grid': [
                " C  ",
                " C  ",
                " C  ",
                "CC  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/C-min.webp",
            'rotation': 0
        },
        'D': {
            'shape': 'D',
            'grid': [
                " D  ",
                " D  ",
                "DD  ",
                " D  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/D-min.webp",
            'rotation': 0
        },
        'E': {
            'shape': 'E',
            'grid': [
                " E  ",
                " E  ",
                "EE  ",
                "E   ",
            ]
            ,
            'image_path': "polysphere_app/static/polysphere_app/images/E-min.webp",
            'rotation': 0
        },
        'F': {
            'shape': 'F',
            'grid': [
                "F   ",
                "FF  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/F-min.webp",
            'rotation': 0
        },
        'G': {
            'shape': 'G',
            'grid': [
                "  G ",
                "  G ",
                "GGG ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/G-min.webp",
            'rotation': 0
        },
        'H': {
            'shape': 'H',
            'grid': [
                "  H ",
                " HH ",
                "HH  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/H-min.webp",
            'rotation': 0
        },
        'I': {
            'shape': 'I',
            'grid': [
                "I I ",
                "III ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/I-min.webp",
            'rotation': 0
        },
        'J': {
            'shape': 'J',
            'grid': [
                " J   ",
                "JJ   ",
                " JJ  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/J-min.webp",
            'rotation': 0
        },
        'K': {
            'shape': 'K',
            'grid': [
                " KK ",
                "KK  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/K-min.webp",
            'rotation': 0
        },
        'L': {
            'shape': 'L',
            'grid': [
                " L  ",
                "LLL ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/L-min.webp",
            'rotation': 0
        },
    }

    def _convert_grid_to_3d(self, grid_2d):
        blocks_3d = []
        for y, row in enumerate(grid_2d):
            for x, cell in enumerate(row):
                if cell.strip():  # If the cell is not empty
                    blocks_3d.append((x, y, 0))  # z-coordinate is 0 for 2D grid
        return blocks_3d


# Testing conversions
pieces_data = Piece3D.pieces_data
pieces_3d = {shape: Piece3D(data['shape'], data['grid']) for shape, data in pieces_data.items()}