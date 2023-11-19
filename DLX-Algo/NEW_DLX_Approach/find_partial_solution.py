# -*- coding: utf-8 -*-
"""
Created on Sat Nov 11 14:58:43 2023

@author: kadam
"""

import re

def generate_regex_pattern(puzzle):
    pattern = ""
    for row in puzzle:
        row_pattern = ""
        for cell in row:
            if cell == ' ':
                row_pattern += '.'  # Any character
            else:
                row_pattern += cell  # Specific character
        pattern += row_pattern + "\n"
    return pattern.rstrip("\n")

# Example partial solution
partial_solution = [
    ['J', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A'],
    ['J', 'J', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A'],
    ['J', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'A', 'A'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
]



# Read solutions from the text file
with open('C:/Users/kadam/Desktop/Folder-1/University/Advanced Computer Science/ASE-Group-6/DLX-Algo/NEW_DLX_Approach/final.txt', 'r') as file:
    solutions_text = file.read()
# Split the text into individual solutions
raw_solutions = solutions_text.strip().split('\n\n')
# Format each solution with newline characters
formatted_solutions = ['\n'.join(solution.split('\n')) for solution in raw_solutions]
# Now, formatted_solutions is a list where each element is a formatted solution string
print(formatted_solutions)



# Generate regex pattern for input
input_pattern = generate_regex_pattern(partial_solution)


# Filter solutions that match the pattern
matching_solutions = []
for solution in formatted_solutions:
    if re.match(input_pattern, solution, re.DOTALL):
        print("Found sol------>")
        matching_solutions.append(solution)

# Print or process the matching solutions
for match in matching_solutions:
    print("Match found:\n",match,"\n")