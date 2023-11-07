class DLX:
    class Node:
        def __init__(self):
            self.left = self
            self.right = self
            self.up = self
            self.down = self
            self.column = None

    class ColumnNode(Node):
        def __init__(self):
            super().__init__()
            self.size = 0

    def __init__(self, numColumns):
        self.root = DLX.ColumnNode()
        self.columns = [DLX.ColumnNode() for _ in range(numColumns)]
        self.numColumns = numColumns

        for i in range(numColumns):
            self.columns[i].left = self.root.left
            self.columns[i].right = self.root
            self.root.left.right = self.columns[i]
            self.root.left = self.columns[i]

    def appendRow(self, columns):
        first = None
        for c in columns:
            new_node = DLX.Node()
            new_node.column = c

            new_node.up = c.up
            new_node.down = c
            c.up.down = new_node
            c.up = new_node

            if first is None:
                first = new_node
            else:
                new_node.left = first.left
                new_node.right = first
                first.left.right = new_node
                first.left = new_node

            c.size += 1

    def search(self, k, solution):
        if self.root.right == self.root:
            return solution

        c = self.chooseColumn()
        self.cover(c)

        r = c.down
        while r != c:
            solution.append(r)

            j = r.right
            while j != r:
                self.cover(j.column)
                j = j.right

            result = self.search(k + 1, solution)
            if result is not None:
                return result

            solution.pop()
            c = r.column

            j = r.left
            while j != r:
                self.uncover(j.column)
                j = j.left

            r = r.down

        self.uncover(c)
        return None

    def cover(self, c):
        c.right.left = c.left
        c.left.right = c.right

        i = c.down
        while i != c:
            j = i.right
            while j != i:
                j.down.up = j.up
                j.up.down = j.down
                j.column.size -= 1
                j = j.right
            i = i.down

    def uncover(self, c):
        i = c.up
        while i != c:
            j = i.left
            while j != i:
                j.down.up = j
                j.up.down = j
                j.column.size += 1
                j = j.left
            i = i.up

        c.right.left = c
        c.left.right = c

    def chooseColumn(self):
        c = self.root.right
        s = c.size
        if s > 1:
            while c != self.root:
                if c.size < s:
                    if c.size == 0:
                        return c
                    s = c.size
                c = c.right
        return c

    def solve(self):
        solution = []
        return self.search(0, solution)

    def solveAll(self):
        solutions = []
        solution = []
        result = self.search(0, solution)
        while result is not None:
            solutions.append(list(solution))
            result = self.search(0, solution)
        return solutions
