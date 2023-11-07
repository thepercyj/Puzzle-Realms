/**********************************************************************************
 * DLX.java
 * Created by your_distant_cousin
 *********************************************************************************/
package com.ydc.kanoodle;

import java.util.ArrayList;
import java.util.List;

/**
 * Dancing links implementation of Knuth's Algorithm X for solving exact cover problems.
 */
public class DLX {

    public interface RowSupplier {
        public abstract boolean isColumnOccupied(int col);
    }

    public static <T extends RowSupplier> List<T> solve(List<T> rowInfo, int numColumns) {
        DLXImpl<T> dlx = new DLXImpl<T>(rowInfo, numColumns);
        return dlx.search(null);
    }

        public static <T extends RowSupplier> List<List<T>> solveAll(List<T> rowInfo, int numColumns) {
        List<List<T>> solutions = new ArrayList<List<T>>();
        DLXImpl<T> dlx = new DLXImpl<T>(rowInfo, numColumns);
        dlx.search(solutions);
        return solutions;
    }

    private static class DLXImpl<T extends RowSupplier> {

        private class Cell {
            Cell up;
            Cell down;
            Header column;
            Row row;
            boolean detached;
        }

        private class Header {
            Header left;
            Header right;
            Cell root;
            int count;

            public Header() {
                root = new Cell();
                root.up = root;
                root.down = root;
                count = 0;
            }
        }

        private class Row {
            ArrayList<Cell> cells;
            T info;

            public Row(T info) {
                this.cells = new ArrayList<Cell>();
                this.info = info;
            }
        }

        private Header columnList_;
        private ArrayList<Header> headers;
        private ArrayList<Row> rows;

        public DLXImpl(List<T> rowInfo, int numColumns) {
            createHeaders(numColumns);
            createRows(rowInfo, numColumns);
        }

        public List<T> search(List<List<T>> solutions) {
            List<T> partialSolution = new ArrayList<T>();
            return search(this.columnList_, partialSolution, solutions);
        }

        private void createRows(List<T> rowInfo, int numColumns) {
            rows = new ArrayList<Row>(rowInfo.size());

            for (T info : rowInfo) {
                Row row = new Row(info);
                for (int c = 0; c < numColumns; c++) {
                    if (info.isColumnOccupied(c)) {
                        Cell cell = new Cell();
                        cell.row = row;
                        cell.column = headers.get(c);
                        cell.up = cell.column.root.up;
                        cell.down = cell.column.root;
                        cell.column.root.up.down = cell;
                        cell.column.root.up = cell;
                        cell.column.count += 1;
                        cell.detached = false;
                        row.cells.add(cell);
                    }
                }
                rows.add(row);
            }
        }

        private void createHeaders(int numColumns) {
            columnList_ = new Header();
            columnList_.right = columnList_;
            columnList_.left = columnList_;

            headers = new ArrayList<Header>(numColumns);
            for (int i = 0; i < numColumns; i++) {
                Header h = new Header();
                h.right = columnList_;
                h.left = columnList_.left;
                columnList_.left.right = h;
                columnList_.left = h;
                headers.add(h);
            }
        }

        private List<T> search(Header columns, List<T> partialSolution, List<List<T>> allSolutions) {
            // if all columns are eliminated, we've found a solution
            if (isColumnListEmpty(columns)) {
                return partialSolution;
            }

            Header column = selectColumn(columns);

            // iterate rows in column, testing recursively with each row selected
            Cell x = column.root.down;
            while (x != column.root) {
                partialSolution.add(x.row.info);

                for (Cell r : x.row.cells) {
                    eliminateColumn(r.column);
                }

                List<T> solution = search(columns, partialSolution, allSolutions);
                if (solution != null) {
                    if (allSolutions != null) {
                        allSolutions.add(new ArrayList<T>(solution));
                    } else {
                        return solution;
                    }
                }

                // Backtrack, reinstating removed columns
                for (Cell r : x.row.cells) {
                    reinstateColumn(r.column);
                }

                partialSolution.remove(partialSolution.size()-1);
                x = x.down;
            }

            return null;
        }

        private boolean isColumnListEmpty(Header columnList) {
            return (columnList.right == columnList);
        }

        private Header selectColumn(Header columnList) {
            // find column with least number of occupied cells
            if (isColumnListEmpty(columnList)) {
                return null;
            }

            Header min = columnList.right;
            Header col = min.right;
            while (col != columnList) {
                if (col.count < min.count) {
                    min = col;
                }
                col = col.right;
            }
            return min;
        }

        private void eliminateColumn(Header column) {
            //   remove all rows with tile in that col
            Cell r = column.root.down;
            while (r != column.root) {
                eliminateRow(r.row, column);
                r = r.down;
            }

            //   remove column from columns
            column.left.right = column.right;
            column.right.left = column.left;
        }

        private void reinstateColumn(Header column) {
            Cell r = column.root.down;
            while (r != column.root) {
                reinstateRow(r.row);
                r = r.down;
            }

            column.left.right = column;
            column.right.left = column;
        }

        private void eliminateRow(Row row, Header skipColumn) {
            for (Cell cell : row.cells) {
                if (cell.column != skipColumn) {
                    if (!cell.detached) {
                        cell.up.down = cell.down;
                        cell.down.up = cell.up;
                        assert cell.column.count > 0;
                        cell.column.count -= 1;
                        cell.detached = true;
                    }
                }
            }
        }

        private void reinstateRow(Row row) {
            for (Cell cell : row.cells) {
                if (cell.detached) {
                    cell.up.down = cell;
                    cell.down.up = cell;
                    cell.column.count += 1;
                    cell.detached = false;
                }
            }
        }

    }
}