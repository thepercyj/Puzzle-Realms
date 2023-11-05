from typing import List
from abc import ABC, abstractmethod

class RowSupplier(ABC):
    @abstractmethod
    def isColumnOccupied(self, col):
        pass

class DLX:
    def __init__(self):
        self.columnList_ = None
        self.headers = []
        self.rows = []

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
            self.root = None
            self.count = 0

    class Row:
        def __init__(self, info):
            self.cells = []
            self.info = info

    @staticmethod
    def solve(rowInfo, numColumns):
        dlx = DLX()
        return dlx.search(None, rowInfo, numColumns)

    @staticmethod
    def solveAll(rowInfo, numColumns):
        solutions = []
        dlx = DLX()
        dlx.search(solutions, rowInfo, numColumns)
        return solutions

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

        self.headers = [self.Header() for _ in range(numColumns)]
        for i in range(numColumns):
            h = self.headers[i]
            h.right = self.columnList_
            h.left = self.columnList_.left
            self.columnList_.left.right = h
            self.columnList_.left = h

    def search(self, columns, rowInfo, numColumns):
        def isColumnListEmpty(columnList):
            return columnList.right == columnList

        def selectColumn(columnList):
            if isColumnListEmpty(columnList):
                return None

            min_ = columnList.right
            col = min_.right
            while col != columnList:
                if col.count < min_.count:
                    min_ = col
                col = col.right
            return min_

        def eliminateColumn(column):
            r = column.root.down
            while r != column.root:
                self.eliminateRow(r.row, column)
                r = r.down

            column.left.right = column.right
            column.right.left = column.left

        def reinstateColumn(column):
            r = column.root.down
            while r != column.root:
                self.reinstateRow(r.row)
                r = r.down

            column.left.right = column
            column.right.left = column

        def eliminateRow(row, skipColumn):
            for cell in row.cells:
                if cell.column != skipColumn:
                    if not cell.detached:
                        cell.up.down = cell.down
                        cell.down.up = cell.up
                        assert cell.column.count > 0
                        cell.column.count -= 1
                        cell.detached = True

        def reinstateRow(row):
            for cell in row.cells:
                if cell.detached:
                    cell.up.down = cell
                    cell.down.up = cell
                    cell.column.count += 1
                    cell.detached = False


        if columns is None:
            columns = self.columnList_

        # if all columns are eliminated, we've found a solution
        if self.isColumnListEmpty(columns):
            return [row.info for row in rowInfo]

        column = self.selectColumn(columns)

        partialSolution = []

        # iterate rows in column, testing recursively with each row selected
        x = column.root.down
        while x != column.root:
            partialSolution.append(x.row.info)

            for r in x.row.cells:
                self.eliminateColumn(r.column)

            solution = self.search(columns, rowInfo, numColumns)
            if solution:
                return solution

            # Backtrack, reinstating removed columns
            for r in x.row.cells:
                self.reinstateColumn(r.column)

            partialSolution.pop()
            x = x.down

        return None
