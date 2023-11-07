class DLX:
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
        print(rowInfo)
        self.createRows(rowInfo, numColumns)

    def search(self, columns, partialSolution, allSolutions):
        if self.isColumnListEmpty(columns):
            return partialSolution
        column = self.selectColumn(columns)
        x = column.root.down
        while x != column.root:
            partialSolution.append(x.row.info)
            for r in x.row.cells:
                self.eliminateColumn(r.column)
            solution = self.search(columns, partialSolution, allSolutions)
            if solution is not None:
                if allSolutions is not None:
                    allSolutions.append(list(solution))
                else:
                    return solution
            for r in x.row.cells:
                self.reinstateColumn(r.column)
            partialSolution.pop()
            x = x.down
        return None

    def isColumnListEmpty(self, columnList):
        return columnList.right == columnList

    def selectColumn(self, columnList):
        if self.isColumnListEmpty(columnList):
            return None
        min = columnList.right
        col = min.right
        while col != columnList:
            if col.count < min.count:
                min = col
            col = col.right
        return min

    def eliminateColumn(self, column):
        r = column.root.down
        while r != column.root:
            self.eliminateRow(r.row, column)
            r = r.down
        column.left.right = column.right
        column.right.left = column.left

    def reinstateColumn(self, column):
        r = column.root.down
        while r != column.root:
            self.reinstateRow(r.row)
            r = r.down
        column.left.right = column
        column.right.left = column

    def eliminateRow(self, row, skipColumn):
        for cell in row.cells:
            if cell.column != skipColumn:
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

    def createRows(self, rowInfo, numColumns):
        self.rows = []
        for info in rowInfo:
            row = DLX.Row(info)
            for c in range(numColumns):
                if info.isColumnOccupied(c):
                    cell = DLX.Cell()
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
        self.columnList_ = DLX.Header()
        self.columnList_.right = self.columnList_
        self.columnList_.left = self.columnList_
        self.headers = []
        for i in range(numColumns):
            h = DLX.Header()
            h.right = self.columnList_
            h.left = self.columnList_.left
            self.columnList_.left.right = h
            self.columnList_.left = h
            self.headers.append(h)

    @staticmethod
    def solve(rowInfo, numColumns):
        dlx = DLX(rowInfo, numColumns)
        return dlx.search(None, [], None)

    @staticmethod
    def solveAll(rowInfo, numColumns):
        solutions = []
        dlx = DLX(rowInfo, numColumns)
        dlx.search(solutions, [], solutions)
        return solutions
