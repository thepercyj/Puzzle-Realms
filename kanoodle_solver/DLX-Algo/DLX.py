class DLX:
    class RowSupplier:
        def isColumnOccupied(self, col):
            pass

    @staticmethod
    def solve(rowInfo, numColumns):
        dlx = DLX(rowInfo, numColumns)
        return dlx.search(None)

    @staticmethod
    def solveAll(rowInfo, numColumns):
        solutions = []
        dlx = DLX(rowInfo, numColumns)
        dlx.search(solutions)
        return solutions

    class Cell:
        def __init__(self):
            self.up = None
            self.down = None
            self.column = None
            self.row = None
            self.detached = False

    class Header:
        def __init__(self):
            self.left = None
            self.right = None
            self.root = DLX.Cell()
            self.count = 0

    class Row:
        def __init__(self, info):
            self.cells = []
            self.info = info

    def __init__(self, rowInfo, numColumns):
        self.columnList_ = None
        self.headers = []
        self.rows = []
        self.createHeaders(numColumns)
        self.createRows(rowInfo, numColumns)

    def search(self, solutions):
        partialSolution = []
        return self.search(self.columnList_, partialSolution, solutions)

    def createRows(self, rowInfo, numColumns):
        self.rows = []

        for info in rowInfo:
            row = self.Row(info)
            for c in range(numColumns):
                if info.isColumnOccupied(c):
                    cell = self.Cell()
                    cell.row = row
                    cell.column = self.headers[c]
                    cell.up = cell.column.root.up
                    cell.down = cell.column.root
                    cell.column.root.up.down = cell
                    cell.column.root.up = cell
                    cell.column.count += 1
                    cell.detached = False
                    row.cells.append(cell)
            self.rows.append(row)

    def createHeaders(self, numColumns):
        self.columnList = self.Header()
        self.columnList.right = self.columnList
        self.columnList.left = self.columnList

        self.headers = []
        for i in range(numColumns):
            h = self.Header()
            h.right = self.columnList
            h.left = self.columnList.left
            self.columnList.left.right = h
            self.columnList.left = h
            self.headers.append(h)

    def search(self, columns, partial_solution, all_solutions):
        # if all columns are eliminated, we've found a solution
        if self.isColumnListEmpty(columns):
            return list(partial_solution)

        column = self.selectColumn(columns)

        # iterate rows in column, testing recursively with each row selected
        x = column.root.down
        while x != column.root:
            partial_solution.append(x.row.info)

            for r in x.row.cells:
                self.eliminateColumn(r.column)

            solution = self.search(columns, partial_solution, all_solutions)
            if solution is not None:
                if all_solutions is not None:
                    all_solutions.append(list(solution))
                else:
                    return solution

            # Backtrack, reinstating removed columns
            for r in x.row.cells:
                self.reinstateColumn(r.column)

            partial_solution.pop()

            x = x.down

        return None

    def isColumnListEmpty(column_list):
        return column_list.right == column_list

    def selectColumn(column_list):
        # find column with least number of occupied cells
        if isColumnListEmpty(column_list):
            return None

        min_ = column_list.right
        col = min_.right
        while col != column_list:
            if col.count < min_.count:
                min_ = col
            col = col.right
        return min_

    def eliminate_column(column):
        # remove all rows with tile in that col
        r = column.root.down
        while r != column.root:
            eliminate_row(r.row, column)
            r = r.down

        # remove column from columns
        column.left.right = column.right
        column.right.left = column.left

    def reinstate_column(column):
        r = column.root.down
        while r != column.root:
            reinstate_row(r.row)
            r = r.down

        column.left.right = column
        column.right.left = column

    def eliminate_row(row, skip_column):
        for cell in row.cells:
            if cell.column != skip_column:
                if not cell.detached:
                    cell.up.down = cell.down
                    cell.down.up = cell.up
                    assert cell.column.count > 0
                    cell.column.count -= 1
                    cell.detached = True

    def reinstate_row(row):
        for cell in row.cells:
            if cell.detached:
                cell.up.down = cell
                cell.down.up = cell
                cell.column.count += 1
                cell.detached = False