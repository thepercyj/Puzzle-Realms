import bpy

pieces_data = {
    'A': {
        'shape': 'A',
        'grid': [
            " A  ",
            " A  ",
            "AA  ",
        ]
    },
    'B': {
        'shape': 'B',
        'grid': [
            " B  ",
            "BB  ",
            "BB  ",
        ]
    },
    'C': {
        'shape': 'C',
        'grid': [
            " C  ",
            " C  ",
            " C  ",
            "CC  ",
        ]
    },
    'D': {
        'shape': 'D',
        'grid': [
            " D  ",
            " D  ",
            "DD  ",
            " D  ",
        ]
    },
    'E': {
        'shape': 'E',
        'grid': [
            " E  ",
            " E  ",
            "EE  ",
            "E   ",
        ]
    },
    'F': {
        'shape': 'F',
        'grid': [
            "F   ",
            "FF  ",
        ]
    },
    'G': {
        'shape': 'G',
        'grid': [
            "  G ",
            "  G ",
            "GGG ",
        ]
    },
    'H': {
        'shape': 'H',
        'grid': [
            "  H ",
            " HH ",
            "HH  ",
        ]
    },
    'I': {
        'shape': 'I',
        'grid': [
            "I I ",
            "III ",
        ]
    },
    'J': {
        'shape': 'J',
        'grid': [
            "J   ",
            "J   ",
            "J   ",
            "J   ",
        ]
    },
    'K': {
        'shape': 'K',
        'grid': [
            "KK  ",
            "KK  ",
        ]
    },
    'L': {
        'shape': 'L',
        'grid': [
            " L  ",
            "LLL ",
            " L  ",
        ]
    },
}

def display_solution(solution_matrix, pieces_data):
    for row_idx, row in enumerate(solution_matrix):
        for col_idx, piece_symbol in enumerate(row):
            if piece_symbol != ' ':
                piece_data = pieces_data[piece_symbol]
                display_piece(piece_data, row_idx, col_idx)

def display_piece(piece_data, row, col):
    bpy.ops.wm.append(
        filepath=piece_data['blender_shape'] + f"\\Object\\{piece_data['shape']}",
        directory=piece_data['blender_shape'] + "\\Object\\"
    )
    obj = bpy.context.view_layer.objects[-1]
    obj.location = (col, -row, 0)  # Adjust the location based on your needs
    bpy.context.collection.objects.link(obj)

# Example usage
solution_matrix = [
    ['A', 'A', 'A', 'G', 'G', 'G', 'I', 'I', 'L', 'L', 'J'],
    ['B', 'B', 'A', 'K', 'K', 'G', 'I', 'L', 'L', 'J', 'J'],
    ['B', 'B', 'K', 'K', 'D', 'G', 'I', 'I', 'L', 'H', 'J'],
    ['C', 'B', 'D', 'D', 'D', 'D', 'E', 'E', 'H', 'H', 'F'],
    ['C', 'C', 'C', 'E', 'E', 'E', 'H', 'H', 'F', 'F', 'F']
]

display_solution(solution_matrix, pieces_data)
