// Create the game board with the given number of rows and columns
function createGameBoard(rows, columns) {
    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';

    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'grid-cell';
            gridCell.setAttribute('data-row', row);
            gridCell.setAttribute('data-col', col);
            gameBoard.appendChild(gridCell);
        }
    }

    document.body.appendChild(gameBoard);
}

createGameBoard(5, 11)
