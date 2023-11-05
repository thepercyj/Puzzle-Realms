# Main.py
# Created by your_distant_cousin

# Constants
GridWidth = 3
GridHeight = 3

Pieces = [
    # " A  \n" +
    # " A  \n" +
    # "AA  \n",

    # " B  \n" +
    # "BB  \n" +
    # "BB  \n",

    # " C  \n" +
    # " C  \n" +
    # " C  \n" +
    # "CC  \n",

    # " D  \n" +
    # " D  \n" +
    # "DD  \n" +
    # " D  \n",

    # " E  \n" +
    # " E  \n" +
    # "EE  \n" +
    # "E   \n",

    # "F   \n" +
    # "FF  \n",

    # "  G \n" +
    # "  G \n" +
    # "GGG \n",

    # "  H \n" +
    # " HH \n" +
    # "HH  \n",

    "I I \n" +
    "III \n",

    "J   \n" +
    "JJ  \n" +
    "J   \n",

    # " KK  \n" +
    # "KK  \n",

    # " L  \n" +
    # "LL  \n" +
    # " LL \n"
]

def main():
    import time

    startTime = int(time.time() * 1000)

    # answer = Kanoodle.findSolution(Pieces, GridWidth, GridHeight)
    # Assuming the Kanoodle module's functions are available
    answer = Kanoodle.findAllSolutions(Pieces, GridWidth, GridHeight)

    endTime = int(time.time() * 1000)

    if answer is not None:
        print(f"Found answer: {answer} in {endTime - startTime} ms.")

if __name__ == "__main__":
    main()
