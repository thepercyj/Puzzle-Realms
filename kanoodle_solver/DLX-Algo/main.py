import time
from Kanoodle import Kanoodle
GridWidth = 3
GridHeight = 3
Pieces = [

    "I I \n" +
    "III \n",

    "J   \n" +
    "JJ  \n" +
    "J   \n",

]
startTime = time.time()

answer = Kanoodle.findAllSolutions(Pieces, GridWidth, GridHeight)
endTime = time.time()
if answer:
    for i, solution in enumerate(answer, 1):
        print(f"Solution {i}:")
        print(solution)
else:
    print("No solution found")
print(f"Elapsed time: {endTime - startTime} ms")
