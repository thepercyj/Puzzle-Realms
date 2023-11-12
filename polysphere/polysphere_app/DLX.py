from abc import ABC, abstractmethod


class DLX:
    class RowSupplier(ABC):
        @abstractmethod
        def isColumnOccupied(self, col) -> bool:
            pass

    @staticmethod
    def solve(row_info, num_columns):
        dlx = DLXImpl(row_info, num_columns)
        return dlx.search(None)

    @staticmethod
    def solveAll(row_info, num_columns):
        # print(f"Debug: row_info: {row_info}, num_columns: {num_columns}")
        solutions = []
        dlx = DLXImpl(row_info, num_columns)
        dlx.search(solutions)
        return solutions


class DLXImpl:
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
            self.root = self.Cell()
            self.root.up = self.root
            self.root.down = self.root
            self.count = 0

        class Cell:
            def __init__(self):
                self.up = None
                self.down = None
                self.column = None
                self.row = None
                self.detached = False

    class Row:
        def __init__(self, info):
            self.cells = []
            self.info = info

    def __init__(self, row_info, num_columns):
        self.createHeaders(num_columns)
        self.createRows(row_info, num_columns)

    def search(self, solutions):
        partial_solution = []
        return self._search(self.column_list_, partial_solution, solutions)

    def createRows(self, row_info, num_columns):
        self.rows = []
        for info in row_info:
            row = DLXImpl.Row(info)
            for c in range(num_columns):
                if info.isColumnOccupied(c):
                    cell = DLXImpl.Cell()
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

    def createHeaders(self, num_columns):
        self.column_list_ = DLXImpl.Header()
        self.column_list_.right = self.column_list_
        self.column_list_.left = self.column_list_
        self.headers = []
        for _ in range(num_columns):
            h = DLXImpl.Header()
            h.right = self.column_list_
            h.left = self.column_list_.left
            self.column_list_.left.right = h
            self.column_list_.left = h
            self.headers.append(h)


    def _search(self, columns, partial_solution, all_solutions):
        if self.isColumnListEmpty(columns):

            return partial_solution

        column = self.selectColumn(columns)

        x = column.root.down
        while x != column.root:
            partial_solution.append(x.row.info)

            for r in x.row.cells:
                self.eliminateColumn(r.column)

            solution = self._search(columns, partial_solution, all_solutions)
            if solution is not None:
                if all_solutions is not None:
                    all_solutions.append(list(solution))
                else:
                    return solution

            for r in reversed(x.row.cells):
                self.reinstateColumn(r.column)

            partial_solution.pop()
            x = x.down

        return None

    def isColumnListEmpty(self, column_list):
        return column_list.right == column_list

    def selectColumn(self, column_list):
        if self.isColumnListEmpty(column_list):
            return None

        min_col = column_list.right
        col = min_col.right
        while col != column_list:
            if col.count < min_col.count:
                min_col = col
            col = col.right
        return min_col

    def eliminateColumn(self, column):
        r = column.root.down
        while r != column.root:
            self.eliminateRow(r.row, column)
            r = r.down
        column.left.right = column.right
        column.right.left = column.left

    def reinstateColumn(self, column):
        r = column.root.up
        while r != column.root:
            self.reinstateRow(r.row)
            r = r.up
        column.left.right = column
        column.right.left = column

    def eliminateRow(self, row, skip_column):
        for cell in row.cells:
            if cell.column != skip_column and not cell.detached:
                cell.up.down = cell.down
                cell.down.up = cell.up
                assert cell.column.count > 0
                cell.column.count -= 1
                cell.detached = True

    def reinstateRow(self, row):
        for cell in reversed(row.cells):
            if cell.detached:
                cell.up.down = cell
                cell.down.up = cell
                cell.column.count += 1
                cell.detached = False