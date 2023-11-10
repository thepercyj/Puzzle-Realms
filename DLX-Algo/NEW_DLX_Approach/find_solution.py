def search_partial_config(partial_config, solutions):
    for idx, solution in enumerate(solutions, start=1):
        for i in range(len(solution) - len(partial_config) + 1):
            for j in range(len(solution[0]) - len(partial_config[0]) + 1):
                match = True
                for pi, row in enumerate(partial_config):
                    for pj, piece in enumerate(row):
                        if piece != ' ' and piece != solution[i + pi][j + pj]:
                            match = False
                            break
                    if not match:
                        break
                if match:
                    print(f"Partial configuration found in solution {idx} at position ({i + 1}, {j + 1})")




# Given partial configuration and solutions
partial_configuration = [
    ['A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'J'],
    ['A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'J', 'J'],
    ['A', 'A', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'J'],
    ['B', 'B', 'B', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['B', 'B', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
]

solutions = [
    [
        ['A', 'F', 'I', 'I', 'J', 'J', 'J', 'K', 'G', 'G', 'G'],
        ['A', 'F', 'F', 'I', 'L', 'J', 'K', 'K', 'H', 'E', 'G'],
        ['A', 'A', 'I', 'I', 'L', 'L', 'K', 'H', 'H', 'E', 'G'],
        ['B', 'B', 'B', 'L', 'L', 'C', 'H', 'H', 'D', 'E', 'E'],
        ['B', 'B', 'C', 'C', 'C', 'C', 'D', 'D', 'D', 'D', 'E'],
    ],
    [
        ['A', 'G', 'G', 'G', 'D', 'D', 'D', 'E', 'E', 'H', 'H'],
        ['A', 'F', 'F', 'G', 'L', 'D', 'E', 'E', 'E', 'H', 'H'],
        ['A', 'A', 'F', 'G', 'L', 'L', 'I', 'I', 'H', 'H', 'J'],
        ['B', 'B', 'B', 'L', 'L', 'C', 'I', 'K', 'K', 'J', 'J'],
        ['B', 'B', 'C', 'C', 'C', 'C', 'I', 'I', 'K', 'K', 'J'],
    ],
    [
        ['A', 'G', 'G', 'G', 'D', 'D', 'D', 'E', 'E', 'E', 'J'],
        ['A', 'F', 'F', 'G', 'L', 'D', 'E', 'E', 'E', 'J', 'J'],
        ['A', 'A', 'F', 'G', 'L', 'L', 'I', 'I', 'H', 'H', 'J'],
        ['B', 'B', 'B', 'L', 'L', 'C', 'I', 'K', 'K', 'H', 'H'],
        ['B', 'B', 'C', 'C', 'C', 'C', 'I', 'I', 'K', 'K', 'H'],
    ],
]

# Call the function
search_partial_config(partial_configuration, solutions)
