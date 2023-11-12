# -*- coding: utf-8 -*-
"""
Created on Sat Nov 11 16:21:14 2023

@author: kadam
"""

def save_unique_solutions(file_path1, file_path2, output_file_path):
    def extract_solutions(file_path):
        with open(file_path, 'r') as file:
            content = file.read()

        return set(content.split('\n\n'))

    solutions1 = extract_solutions(file_path1)
    solutions2 = extract_solutions(file_path2)

    unique_solutions = solutions1.union(solutions2)

    with open(output_file_path, 'w') as output_file:
        for unique_solution in unique_solutions:
            output_file.write(unique_solution + '\n\n')

# Example usage:
file_path1 = r"C:\Users\kadam\Desktop\Folder-1\University\Advanced Computer Science\ASE-Group-6\DLX-Algo\NEW_DLX_Approach\output_Non-mirrored.txt"
file_path2 = r"C:\Users\kadam\Desktop\Folder-1\University\Advanced Computer Science\ASE-Group-6\DLX-Algo\NEW_DLX_Approach\output_Mirrored.txt"
output_file_path = r"C:\Users\kadam\Desktop\Folder-1\University\Advanced Computer Science\ASE-Group-6\DLX-Algo\NEW_DLX_Approach\solutions.txt.txt"

save_unique_solutions(file_path1, file_path2, output_file_path)
