class DLX:
    class RowSupplier:
        def isColumnOccupied(self, col):
            pass

    @staticmethod
    def solve(rowInfo, numColumns):
        dlx = DLX(rowInfo, numColumns)
        return dlx.search(None)

    @staticmethod
    def solve_all(rowInfo, numColumns):
        dlx = DLX(rowInfo, numColumns)
        solutions = []
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
        self._search(self.columnList_, partialSolution, solutions)

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
        self.columnList_ = self.Header()
        self.columnList_.right = self.columnList_
        self.columnList_.left = self.columnList_

        self.headers = []
        for i in range(numColumns):
            h = self.Header()
            h.right = self.columnList_
            h.left = self.columnList_.left
            self.columnList_.left.right = h
            self.columnList_.left = h
            self.headers.append(h)

    def _search(self, columns, partial_solution, all_solutions):
        # if all columns are eliminated, we've found a solution
        if self.isColumnListEmpty(columns):
            all_solutions.append(list(partial_solution))
            return

        column = self.selectColumn(columns)

        # iterate rows in column, testing recursively with each row selected
        x = column.root.down
        while x != column.root:
            partial_solution.append(x.row.info)

            for r in x.row.cells:
                self.eliminateColumn(r.column)

            self._search(columns, partial_solution, all_solutions)

            # Backtrack, reinstating removed columns
            for r in x.row.cells:
                self.reinstateColumn(r.column)

            partial_solution.pop()

            x = x.down

    def isColumnListEmpty(self, column_list):
        return column_list.right == column_list

    def selectColumn(self, column_list):
        # find column with the least number of occupied cells
        if self.isColumnListEmpty(column_list):
            return None

        min_ = column_list.right
        col = min_.right
        while col != column_list:
            if col.count < min_.count:
                min_ = col
            col = col.right
        return min_

    def eliminateColumn(self, column):
        # remove all rows with a tile in that column
        r = column.root.down
        while r != column.root:
            self.eliminateRow(r.row, column)
            r = r.down

        # remove the column from columns
        column.left.right = column.right
        column.right.left = column.left

    def reinstateColumn(self, column):
        r = column.root.down
        while r != column.root:
            self.reinstateRow(r.row)
            r = r.down

        column.left.right = column
        column.right.left = column

    def eliminateRow(self, row, skip_column):
        for cell in row.cells:
            if cell.column != skip_column:
                if not cell.detached:
                    cell.up.down = cell.down
                    cell.down.up = cell.up
                    assert cell.column.count > 0
                    cell.column.count -= 1
                    cell.detached = True

    def reinstateRow(self, row):
        for cell in row.cells:
            if cell.detached:
                cell.up.down = cell
                cell.down.up = cell
                cell.column.count += 1
                cell.detached = False