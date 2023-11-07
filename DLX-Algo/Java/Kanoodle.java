/**********************************************************************************
 * Kanoodle.java
 * Created by your_distant_cousin
 *********************************************************************************/
package com.ydc.kanoodle;

import java.util.*;

public class Kanoodle {

 //   public static String findSolution(String[] pieceDescriptions, int gridWidth, int gridHeight) {
//        Piece[] pieces = createPieces(pieceDescriptions, gridWidth, gridHeight);
 //       List<SearchRow> rows = createSearchRows(pieces, gridWidth, gridHeight);
  //      List<SearchRow> solution = DLX.solve(rows, gridWidth * gridHeight + pieces.length);
   //     if (solution != null) {
    //        return formatGrid(solution, gridWidth, gridHeight);
     //   }
      //  return "No solution found";
    //}

    public static String findAllSolutions(String[] pieceDescriptions, int gridWidth, int gridHeight) {
        Piece[] pieces = createPieces(pieceDescriptions, gridWidth, gridHeight);
        List<SearchRow> rows = createSearchRows(pieces, gridWidth, gridHeight);
        List<List<SearchRow>> solutions = DLX.solveAll(rows, gridWidth * gridHeight + pieces.length);
        if (solutions != null) {
            return formatGrid(solutions, gridWidth, gridHeight);
        }
        //return "" + solutions.size();
        return "No solution found";
    }

    private static Piece[] createPieces(String[] pieceDescriptions, int gridWidth, int gridHeight) {
        Piece[] pieces = new Piece[pieceDescriptions.length];
        for (int i = 0; i < pieceDescriptions.length; i++) {
            pieces[i] = new Piece(pieceDescriptions[i], i, gridWidth, gridHeight);
        }
        return pieces;
    }

    private static List<SearchRow> createSearchRows(Piece[] pieces, int gridWidth, int gridHeight) {
        final Rotation[] rotations = Rotation.values();
        final boolean[] flipStates = {false, true};
        final int maxPiecePermutations = pieces.length * rotations.length * flipStates.length;
        List<SearchRow> rows = new ArrayList<SearchRow>(maxPiecePermutations * gridWidth * gridHeight);
        HashSet<Long> pieceSignatures = new HashSet<Long>(maxPiecePermutations);

        for (Piece piece : pieces) {
            for (Rotation rotation : rotations) {
                for (boolean flip : flipStates) {
                    Long signature = piece.getSignature(rotation, flip);
                    // Omit rows for pieces which when rotated/flipped match the shape of a previous piece
                    if (!pieceSignatures.contains(signature)) {
                        pieceSignatures.add(signature);
                        int maxCol = gridWidth - piece.getWidth(rotation);
                        int maxRow = gridHeight - piece.getHeight(rotation);
                        for (int row = 0; row <= maxRow; row++) {
                            for (int col = 0; col <= maxCol; col++) {
                                rows.add(new SearchRow(piece, rotation, col, row, flip));

                            }
                        }
                    }
                }
            }
        }
        return rows;
    }

    public static String formatGrid(List<List<SearchRow>> solutions, int gridWidth, int gridHeight) {
        List<String> formattedSolutions = new ArrayList<>();
        for (List<SearchRow> sol : solutions) {
            char[][] grid = new char[gridHeight][gridWidth];
            for (int r = 0; r < gridHeight; r++) {
                Arrays.fill(grid[r], ' ');
            }
            for (SearchRow row : sol) {
                int h = row.piece.getHeight(row.rotation);
                int w = row.piece.getWidth(row.rotation);
                for (int r = 0; r < h; r++) {
                    for (int c = 0; c < w; c++) {
                        if (row.piece.isTileAt(c, r, row.rotation, row.flipped)) {
                            grid[row.row + r][row.col + c] = row.piece.symbol;
                        }
                    }
                }
            }
        StringBuilder res = new StringBuilder((gridWidth + 1) * gridHeight);
        res.append('\n');
        for (int r = 0; r < gridHeight; r++) {
            res.append(grid[r]);
            res.append('\n');
        }

        formattedSolutions.add(res.toString());
    //    System.out.println("rows: " + formattedSolutions );
    }

    return formattedSolutions.toString();
    }


    enum Rotation {
        ROTATION_0,
        ROTATION_90,
        ROTATION_180,
        ROTATION_270,
    }

    static class Tile {
        int col;
        int row;

        public Tile(int col, int row) {
            this.col = col;
            this.row = row;
        }
    }

    private static class Piece {
        public final int index;
        public final String source;
        public final char symbol;
        public final int gridWidth;
        public final int gridHeight;
        private final Tile dimensions;
        private final long bitfield;

        public Piece(String src, int index, int gridWidth, int gridHeight) {
            this.index = index;
            this.source = src;
            this.symbol = src.replaceFirst("^\\s+", "").charAt(0);
            this.gridWidth = gridWidth;
            this.gridHeight = gridHeight;
            this.dimensions = new Tile(0, 0);
            Tile[] tiles = extractTiles(src, dimensions);
            bitfield = buildBitfield(tiles, dimensions);
        }

        private static long buildBitfield(Tile[] tiles, Tile dimensions) {
            assert dimensions.col <= 8;
            assert dimensions.row <= 8;
            long bits = 0;
            for (Tile t : tiles) {
                bits |= 1L << (t.row * 8 + t.col);
            }
            return bits;
        }

        private static Tile[] extractTiles(String src, Tile max) {
            ArrayList<Tile> tiles = new ArrayList<Tile>(src.replaceAll("\\s", "").length());
            int col = 0;
            int row = 0;
            for (int i = 0; i < src.length(); ++i) {
                char c = src.charAt(i);
                if (c == '\n') {
                    col = 0;
                    row += 1;
                }
                else if (!Character.isWhitespace(c)) {
                    max.col = Math.max(max.col, col+1);
                    max.row = Math.max(max.row, row+1);
                    tiles.add(new Tile(col++, row));
                }
                else {
                    ++col;
                }
            }
            return tiles.toArray(new Tile[tiles.size()]);
        }

        public int getWidth() {
            return dimensions.col;
        }

        public int getHeight() {
            return dimensions.row;
        }

        public int getWidth(Rotation r) {
            if (r == Rotation.ROTATION_0 || r == Rotation.ROTATION_180)
                return dimensions.col;
            return dimensions.row;
        }

        public int getHeight(Rotation r) {
            if (r == Rotation.ROTATION_0 || r == Rotation.ROTATION_180)
                return dimensions.row;
            return dimensions.col;
        }

        public boolean isTileAt(int col, int row, Rotation rotation, boolean flipped) {

            int localCol = col;
            int localRow = row;

            switch (rotation) {

                case ROTATION_0:
                    if (flipped) {
                        localCol = getWidth() - 1 - col;
                    }
                    break;
                case ROTATION_90:
                    localCol = row;
                    localRow = getHeight() - 1 - col;
                    if (flipped) {
                        localRow = getHeight() - 1 - localRow;
                    }
                    break;
                case ROTATION_180:
                    if (!flipped) {
                        localCol = getWidth() - 1 - localCol;
                    }
                    localRow = getHeight() - 1 - localRow;
                    break;
                case ROTATION_270:
                    localCol = getWidth() - 1 - row;
                    localRow = col;
                    if (flipped) {
                        localRow = getHeight() - 1 - localRow;
                    }
                    break;
            }


            if (localCol >= 0 && localRow >= 0 && localCol < getWidth() && localRow < getHeight()) {
                if (0 != (bitfield & (1L << (localRow*8 + localCol))))
                    return true;
            }
            return false;
        }

        public long getSignature(Rotation rotation, boolean flipped) {
            long signature = 0L;
            for (int r = 0; r < 8; r++) {
                for (int c = 0; c < 8; c++) {
                    if (isTileAt(c, r, rotation, flipped)) {
                        signature |= 1L << (r*8 + c);
                    }
                }
            }
            return signature;
        }
    }

    static class SearchRow implements DLX.RowSupplier {
        final Piece piece;
        final Rotation rotation;
        final int col;
        final int row;
        final boolean flipped;


        public SearchRow(Piece piece, Rotation rotation, int col, int row, boolean flipped) {
            this.piece = piece;
            this.rotation = rotation;
            this.col = col;
            this.row = row;
            this.flipped = flipped;
        }

        public boolean isTileAt(int c, int r) {
            return piece.isTileAt(c - this.col, r - this.row, this.rotation, this.flipped);
        }

        @Override
        public boolean isColumnOccupied(int col) {
            // columns beyond grid size represent pieces. This allows each piece to be used once
            if (col >= (piece.gridWidth*piece.gridHeight)) {
                return (piece.index == col - (piece.gridWidth*piece.gridHeight));
            }

            return isTileAt(col % piece.gridWidth, col / piece.gridWidth);
        }
    }
}