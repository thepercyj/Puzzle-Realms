class DLX:
    class Cell:
        def __init__(self):
            self.up = self.down = self.left = self.right = self.column = None

    class Column:
        def __init__(self):
            self.size = 0
            self.name = None
            self.up = self.down = self.left = self.right = self

    class Header(Column):
        pass

    class Data(Column):
        def __init__(self):
            super().__init__()
            self.row = None
            self.value = None  # Add a value attribute to the Data class

    def __init__(self, num_columns):
        self.num_columns = num_columns
        self.header = None
        self.rows = []
        self.solutions = []

        # Initialize the header nodes
        self.header = [self.Column() for _ in range(num_columns)]
        for i in range(num_columns):
            self.header[i].name = str(i)
            self.header[i].left = self.header[(i - 1) % num_columns]
            self.header[i].right = self.header[(i + 1) % num_columns]

        self.header[0].left = self.header[-1]
        self.header[-1].right = self.header[0]

        # Initialize the data nodes
        self.rows = [[None for _ in range(num_columns)] for _ in range(num_columns)]
        for i in range(num_columns):
            for j in range(num_columns):
                if i == j:
                    node = self.Data()
                    node.row = i
                    node.column = self.header[j]
                    node.up = self.header[j].up
                    node.down = self.header[j]
                    self.header[j].up.down = node
                    self.header[j].up = node
                    self.header[j].size += 1
                    self.rows[i][j] = node
                else:
                    self.rows[i][j] = None

    def cover(self, column):
        column.right.left = column.left
        column.left.right = column.right
        node = column.down
        while node != column:
            right_node = node.right
            while right_node != node:
                right_node.down.up = right_node.up
                right_node.up.down = right_node.down
                right_node.column.size -= 1
                right_node = right_node.right
            node = node.down

    def uncover(self, column):
        node = column.up
        while node != column:
            left_node = node.left
            while left_node != node:
                left_node.column.size += 1
                left_node.down.up = left_node
                left_node.up.down = left_node
                left_node = left_node.left
            node = node.up
        column.right.left = column
        column.left.right = column

    def search(self, k=0):
        solutions = []  # Initialize an empty list to store solutions

        def _search(k=0):
            if self.header[0].right == self.header[0]:
                solution = [row[:] for row in self.rows]
                solutions.append(solution)
            else:
                column = self.choose_column()
                self.cover(column)
                node = column.down
                while node != column:
                    row = node.row
                    self.rows[row] = [cell for cell in self.rows[row] if cell != node]
                    right_node = node.right
                    while right_node != node:
                        self.cover(right_node.column)
                        right_node = right_node.right
                    _search(k + 1)
                    left_node = node.left
                    while left_node != node:
                        self.uncover(left_node.column)
                        left_node = left_node.left
                    self.rows[row].append(node)
                    node = node.down
                self.uncover(column)

        _search()
        return solutions

    def choose_column(self):
        column = self.header[0].right
        min_size = column.size
        node = column.right
        while node != self.header[0]:
            if node.size < min_size:
                column = node
                min_size = node.size
            node = node.right
        return column



