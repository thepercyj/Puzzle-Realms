import os
class PuzzlePieces:
    def __init__(self, shape, grid, image_path, rotation ):
        self.shape = shape
        self.grid = grid
        self.image_path = image_path
        self.rotation = rotation

    pieces_data = {
        'A': {
            'shape': 'A',
            'grid': [
                " A  ",
                " A  ",
                "AA  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/A-min.png",
            'rotation': 0
        },
        'B': {
            'shape': 'B',
            'grid': [
                " B  ",
                "BB  ",
                "BB  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/B-min.png",
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
            'image_path': "polysphere_app/static/polysphere_app/images/C-min.png",
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
            'image_path': "polysphere_app/static/polysphere_app/images/D-min.png",
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
            'image_path': "polysphere_app/static/polysphere_app/images/E-min.png",
            'rotation': 0
        },
        'F': {
            'shape': 'F',
            'grid': [
                "F   ",
                "FF  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/F-min.png",
            'rotation': 0
        },
        'G': {
            'shape': 'G',
            'grid': [
                "  G ",
                "  G ",
                "GGG ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/G-min.png",
            'rotation': 0
        },
        'H': {
            'shape': 'H',
            'grid': [
                "  H ",
                " HH ",
                "HH  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/H-min.png",
            'rotation': 0
        },
        'I': {
            'shape': 'I',
            'grid': [
                "I I ",
                "III ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/I-min.png",
            'rotation': 0
        },
        'J': {
            'shape': 'J',
            'grid': [
                " J   ",
                "JJ   ",
                " JJ  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/J-min.png",
            'rotation': 0
        },
        'K': {
            'shape': 'K',
            'grid': [
                " KK ",
                "KK  ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/K-min.png",
            'rotation': 0
        },
        'L': {
            'shape': 'L',
            'grid': [
                " L  ",
                "LLL ",
            ],
            'image_path': "polysphere_app/static/polysphere_app/images/L-min.png",
            'rotation': 0
        },
    }