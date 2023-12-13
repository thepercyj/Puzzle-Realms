from abc import ABC, abstractmethod


class DLX:
    """
    DLX class represents the Dancing Links algorithm implementation.
    It provides methods to solve the exact cover problem using DLX algorithm.
    """

    class RowSupplier(ABC):
        @abstractmethod
        def isColumnOccupied(self, col) -> bool:
            pass

    @staticmethod
    def solve(row_info, num_columns):
        """
        Solves the exact cover problem using DLX algorithm.

        Parameters:
        - row_info (list): List of row information.
        - num_columns (int): Number of columns.

        Returns:
        - list: List of solutions.
        """
        dlx = DLXImpl(row_info, num_columns)
        return dlx.search(None)

    @staticmethod
    def solveAll(row_info, num_columns):
        """
        Solves all possible solutions for the exact cover problem using DLX algorithm.

        Parameters:
        - row_info (list): List of row information.
        - num_columns (int): Number of columns.

        Returns:
        - list: List of all solutions.
        """
        solutions = []
        dlx = DLXImpl(row_info, num_columns)
        dlx.search(solutions)
        return solutions


class DLXImpl:
    """
    Implementation of the Dancing Links (DLX) algorithm for solving exact cover problems.
    """

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
        """
        Initializes the DLXImpl object.

        Args:
            row_info (list): List of RowInfo objects representing the rows of the exact cover problem.
            num_columns (int): Number of columns in the exact cover problem.
        """
        self.createHeaders(num_columns)
        self.createRows(row_info, num_columns)

    def search(self, solutions):
        """
        Searches for solutions to the exact cover problem.

        Args:
            solutions (list): List to store the solutions found.

        Returns:
            list: The first solution found, or None if no solution is found.
        """
        partial_solution = []
        return self._search(self.column_list_, partial_solution, solutions)

    def createRows(self, row_info, num_columns):
        """
        Creates the rows of the exact cover problem.

        Args:
            row_info (list): List of RowInfo objects representing the rows of the exact cover problem.
            num_columns (int): Number of columns in the exact cover problem.
        """
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
        """
        Creates the headers of the exact cover problem.

        Args:
            num_columns (int): Number of columns in the exact cover problem.
        """
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
        """
        Recursive helper function for searching solutions to the exact cover problem.

        Args:
            columns (Header): The current column list.
            partial_solution (list): The current partial solution.
            all_solutions (list): List to store all solutions found.

        Returns:
            list: The first solution found, or None if no solution is found.
        """
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
        """
        Checks if the column list is empty.

        Args:
            column_list (Header): The column list.

        Returns:
            bool: True if the column list is empty, False otherwise.
        """
        return column_list.right == column_list

    def selectColumn(self, column_list):
        """
        Selects the column with the fewest number of ones.

        Args:
            column_list (Header): The column list.

        Returns:
            Header: The selected column.
        """
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
        """
        Eliminates a column from the column list.

        Args:
            column (Header): The column to eliminate.
        """
        r = column.root.down
        while r != column.root:
            self.eliminateRow(r.row, column)
            r = r.down
        column.left.right = column.right
        column.right.left = column.left

    def reinstateColumn(self, column):
        """
        Reinstates a column into the column list.

        Args:
            column (Header): The column to reinstate.
        """
        r = column.root.up
        while r != column.root:
            self.reinstateRow(r.row)
            r = r.up
        column.left.right = column
        column.right.left = column

    def eliminateRow(self, row, skip_column):
        """
        Eliminates a row from the column list.

        Args:
            row (Row): The row to eliminate.
            skip_column (Header): The column to skip during elimination.
        """
        for cell in row.cells:
            if cell.column != skip_column and not cell.detached:
                cell.up.down = cell.down
                cell.down.up = cell.up
                assert cell.column.count > 0
                cell.column.count -= 1
                cell.detached = True

    def reinstateRow(self, row):
        """
        Reinstates a row into the column list.

        Args:
            row (Row): The row to reinstate.
        """
        for cell in reversed(row.cells):
            if cell.detached:
                cell.up.down = cell
                cell.down.up = cell
                cell.column.count += 1
                cell.detached = False
