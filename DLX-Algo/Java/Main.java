/**********************************************************************************
 * Main.java
 * Created by your_distant_cousin
 *********************************************************************************/

package com.ydc.kanoodle;

public class Main {

    public static final int GridWidth = 3;
    public static final int GridHeight = 4;

    public static final String[] Pieces = {
//
//                    "I I \n"+
//                    "III \n",
//
//                    "J   \n"+
//                    "JJ  \n"+
//                    "J   \n",

                    " L \n"+
                    " L \n"+
                    " L \n"
    };



    public static void main(String[] args) {
        long startTime = System.currentTimeMillis();

        // Initialize the board with 2 pieces
       char[][] initialBoard = new char[GridHeight][GridWidth];
        initializeBoard(initialBoard, GridHeight, GridWidth);
        // Convert the board to a string format that matches the piece descriptions
        StringBuilder boardDescription = new StringBuilder();
        for (int i = 0; i < GridHeight; i++) {
            for (int j = 0; j < GridWidth; j++) {
                boardDescription.append(initialBoard[i][j]);
            }
            boardDescription.append("\n");
        }

        // Add the board description to the list of pieces
        String[] modifiedPieces = new String[Pieces.length + 1];
        System.arraycopy(Pieces, 0, modifiedPieces, 0, Pieces.length);
        modifiedPieces[Pieces.length] = boardDescription.toString();

        // Use the modifiedPieces array to find solutions

        String answer = Kanoodle.findAllSolutions(modifiedPieces, GridWidth, GridHeight);
        long endTime = System.currentTimeMillis();

        if (answer != null) {
            System.out.println("Found answer: " + answer + " in " + (endTime - startTime) + " ms.");
        }
    }

    private static void initializeBoard(char[][] board,  int GridHeight, int GridWidth) {
        // Example: Place piece I at (0, 0) and piece I at (0, 2)
        // Initialize the board with empty spaces
        for (int i = 0; i < GridHeight; i++) {
            for (int j = 0; j < GridWidth; j++) {
                board[i][j] = ' ';
            }
        }
        board[0][0] = 'I';
        board[0][1] = 'I';
        board[1][0] = 'I';
        board[2][0] = 'I';
        board[2][1] = 'I';

        board[0][2] = 'J';
        board[1][1] = 'J';
        board[1][2] = 'J';
        board[2][2] = 'J';


    }

}

