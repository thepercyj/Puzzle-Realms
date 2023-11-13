window.onload = function() {
        const imageIds = [
            "shape-1", "shape-2", "shape-3", "shape-4", "shape-5", "shape-6",
            "shape-7", "shape-8", "shape-9", "shape-10", "shape-11", "shape-12"
        ];
        let currentIndex = 0;
        let rotationAngle = 0;
        let alphabets = ["I", "E", "J", "L", "D", "B", "K", "A", "G", "C", "F", "H"];
        let moveHistory = [];


        const currentImage = document.getElementById('currentImage');
        const piecesContainer = document.getElementById('piecesContainer');
        const board = document.getElementById('board');
        const boardMatrix = createBoardMatrix();

        let rotationAngles = Array(12).fill(0);
        let scaleXY = Array.from({
            length: 12
        }, () => [1, 1]);
        let initXY = Array.from({
            length: 12
        }, () => [0, 0]);
        let isMouseMoveListenerAdded = Array(12).fill(false);

        let gridData = Array.from({
            length: 5
        }, () => Array(11).fill(null));
        let gridColor = ["#2F922C", "#672598", "#0A8286", "#9C3A3A", "#A0A125", "#9B108E", "#9A5835", "#223A21", "#191A92", "#946D98", "#256191", "#A0A467"];
    let pieces = [
        [[0, -1], [0, 0], [0, 1],
            [1, -1], [1, 1]],

        [[0, 0], [0, 1],
            [1, -2], [1, -1], [1, 0]],

        [[-1, 0],
            [0, -1], [0, 0],
            [1, 0], [1, 1]],

        [[-1, 0],
            [0, -1], [0, 0], [0, 1]],

        [[-1, 0],
            [0, -1], [0, 0], [0, 1], [0, 2]],

        [[0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]],

        [[0, 0], [0, 1],
            [1, -1], [1, 0]],

        [[0, 0], [0, 1],
            [1, 0],
            [2, 0]],

        [[0, -2], [0, -1], [0, 0],
            [1, 0],
            [2, 0]],

        [[-1, 0],
            [0, 0], [0, 1], [0, 2], [0, 3]],

        [[-1, 0],
            [0, 0], [0, 1]],

        [[-1, -1], [-1, 0],
            [0, 0], [0, 1],
            [1, 1]],
    ];

    // Stores the orientation and flip status of the pieces
    let pieceRotation = new Array(12).fill(0)
    let horizontalFlip = new Array(12).fill(false)
    let verticalFlip = new Array(12).fill(false)

    function storeMoveState() {
        const state = {
            gridData: JSON.parse(JSON.stringify(gridData)), // Deep copy the gridData
            pieceRotation: [...pieceRotation],
            horizontalFlip: [...horizontalFlip],
            verticalFlip: [...verticalFlip],
            rotationAngle: rotationAngle
        };
        moveHistory.push(state);
    }

    function undoMove() {
        if (moveHistory.length > 0) {
            const prevState = moveHistory.pop();
            gridData = JSON.parse(JSON.stringify(prevState.gridData)); // Restore gridData
            pieceRotation = [...prevState.pieceRotation];
            horizontalFlip = [...prevState.horizontalFlip];
            verticalFlip = [...prevState.verticalFlip];
            rotationAngle = prevState.rotationAngle;

            updateBoard(); // Update the visual representation of the board
        }
    }

    function updateBoard() {
        // Clear the board colors and data
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const cell = document.querySelector(.cell[data - row = "${row}"][data - col = "${col}"]);
                cell.style.backgroundColor = gridData[row][col] || '';
            }
        }
        // Reset the pieces on the board
        for (let i = 0; i < pieces.length; i++) {
            const pieceIndex = i;
            const coords = pieces[pieceIndex];

            // Reset piece position
            const initialX = initXY[pieceIndex][0];
            const initialY = initXY[pieceIndex][1];
            const piece = document.getElementById(piece - $ {
                pieceIndex + 1
            });
            piece.style.left = initialX + 'px';
            piece.style.top = initialY + 'px';

            // Apply transformations
            applyTransformations(piece, coords, rotationAngle, horizontalFlip[pieceIndex], verticalFlip[pieceIndex]);

            // Reset drag data
            piece.dataset.dragged = 'false';
        }
    }


    function createBoardMatrix() {
        const matrix = [];
        for (let row = 0; row < 5; row++) {
            matrix[row] = [];
            for (let col = 0; col < 11; col++) {
                matrix[row][col] = null; // Initially, no piece is placed
            }
        }
        return matrix;
    }

    function updateImage() {
        currentImage.src = `/static/polysphere_app/images/shapes/${imageIds[currentIndex]}.png`;
        currentImage.style.transform = `rotate(${rotationAngle}deg)`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % imageIds.length;
        rotationAngle = 0; // Reset rotation when changing images
        updateImage();
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + imageIds.length) % imageIds.length;
        rotationAngle = 0; // Reset rotation when changing images
        updateImage();
    }

    function rotateClockwise() {
        rotationAngle = (rotationAngle + 90) % 360;
        pieceRotation[currentIndex] = rotationAngle
        updateImage();
    }

    function rotateCounterclockwise() {
        rotationAngle = (rotationAngle - 90 + 360) % 360;
        pieceRotation[currentIndex] = rotationAngle;
        updateImage();
    }

    function flipHorizontal() {
        horizontalFlip[currentIndex] = !horizontalFlip[currentIndex];
        applyCurrentTransformations(); // Apply current transformations to the image
    }

    function flipVertical() {
        verticalFlip[currentIndex] = !verticalFlip[currentIndex];
        applyCurrentTransformations(); // Apply current transformations to the image
    }

    function applyCurrentTransformations() {
        let transform = `rotate(${rotationAngle}deg)`;
        if (horizontalFlip[currentIndex]) {
            transform += ' scaleX(-1)';
        }
        if (verticalFlip[currentIndex]) {
            transform += ' scaleY(-1)';
        }
        currentImage.style.transform = transform;
    }

    const previousImageButton = document.getElementById('previousImageButton');
    const nextImageButton = document.getElementById('nextImageButton');
    const rotateClockwiseButton = document.getElementById('rotateClockwise');
    const rstboard = document.getElementById('resetBoard');
    const rotateCounterclockwiseButton = document.getElementById('rotateCounterclockwise');
    const resetbrd = document.getElementById('resetBoard');
    const flipHorizontalButton = document.getElementById('flipHorizontal');
    const flipVerticalButton = document.getElementById('flipVertical');
    const undoButton = document.getElementById('undoButton');


    previousImageButton.addEventListener('click', previousImage);
    nextImageButton.addEventListener('click', nextImage);
    rstboard.addEventListener('click', resetBoard);
    rotateClockwiseButton.addEventListener('click', rotateClockwise);
    rotateCounterclockwiseButton.addEventListener('click', rotateCounterclockwise);
    resetbrd.addEventListener('click', resetBoard);
    flipHorizontalButton.addEventListener('click', flipHorizontal);
    flipVerticalButton.addEventListener('click', flipVertical);
    undoButton.addEventListener('click', undoMove);

    updateImage();

    // Board initialization
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 11; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('dragover', allowDrop);
            cell.addEventListener('drop', drop);
            board.appendChild(cell);
        }
    }

    // Piece initialization
    for (let i = 1; i < 13; i++) {
        const piece = document.createElement('img');
        piece.src = `/static/polysphere_app/images/shapes/shape-${i}.png`;
        piece.alt = `Piece ${i}`;
        piece.id = `piece-${i}`;
        piece.className = 'draggable-piece';
        piece.draggable = true;
        piece.addEventListener('dragstart', dragStart);
        piecesContainer.appendChild(piece);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        // Updates the rotation state of the piece being dragged
        const pieceId = event.target.id.replace('piece-', 'shape-')
        const pieceIndex = imageIds.indexOf((pieceId));
        pieceRotation[pieceIndex] = rotationAngle;
    }

    function drop(event) {
        event.preventDefault();
        const cell = event.target;

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (cell.classList.contains('cell')) {
            const pieceCoords = pieces[currentIndex];
            const rotatedPieceCoords = rotateCoords(pieceCoords, pieceRotation[currentIndex])
            const flippedPieceCoords = applyFlips(rotatedPieceCoords, currentIndex)

            // Check if the cells for the new piece are unoccupied
            if (isSpaceAvailable(row, col, flippedPieceCoords)) {
                // Iterate through the coordinates of the current piece
                for (const coord of flippedPieceCoords) {
                    const newRow = row + coord[0];
                    const newCol = col + coord[1];

                    // Color the cell based on the piece coordinates
                    const targetCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                    targetCell.style.backgroundColor = gridColor[currentIndex];
                    // Update the board matrix with the color information
                    gridData[newRow][newCol] = alphabets[currentIndex]; //Returns the same alphabet as the currentIndex of the peice.
                }
            }
        }
    }

    // Check if the cells for the new piece are unoccupied
    function isSpaceAvailable(startRow, startCol, pieceCoords) {
        for (const coord of pieceCoords) {
            const newRow = startRow + coord[0];
            const newCol = startCol + coord[1];

            // Check if the new coordinates are within the board bounds
            if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 11) {
                return false;
            }

            // Check if the cell is already occupied
            if (gridData[newRow][newCol] !== null) {
                return false;
            }
        }
        return true;
    }

    // Reset the drag data when the drag ends
    function dragEnd() {
        currentImage.style.display = 'block';
        currentImage.style.left = '0';
        currentImage.style.top = '0';
    }

    function rotateCoords(coords, angle) {
        return coords.map(coord => {
            switch (angle) {
                case 90:
                    return [-coord[1], coord[0]];
                case 180:
                    return [-coord[0], -coord[1]];
                case 270:
                    return [coord[1], -coord[0]];
                default:
                    return coord;
            }
        });
    }

    function applyFlips(coords, index) {
        let transformedCoords = coords;
        if (horizontalFlip[index]) {
            transformedCoords = transformedCoords.map(coord => [-coord[0], coord[1]]);
        }
        if (verticalFlip[index]) {
            transformedCoords = transformedCoords.map(coord => [coord[0], -coord[1]]);
        }
        return transformedCoords;
    }

    function flipCoordsHorizontally(coords) {
        return coords.map(coord => [-coord[0], -coord[1]]); // Placeholder logic
    }

    function flipCoordsVertically(coords) {
        return coords.map(coord => [-coord[0], -coord[1]]); // Placeholder logic
    }

    function resetBoard() {
        console.log("Grid data..", gridData);
        // Clear the board colors and data
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell.style.backgroundColor = '#FFF';
                gridData[row][col] = null;
            }

        }
        // Reset the pieces on the board
        for (let i = 0; i < pieces.length; i++) {
            const pieceIndex = i;
            const coords = pieces[pieceIndex];

            // Reset piece position
            const initialX = initXY[pieceIndex][0];
            const initialY = initXY[pieceIndex][1];
            const piece = document.getElementById(`piece-${pieceIndex + 1}`);
            piece.style.left = initialX + 'px';
            piece.style.top = initialY + 'px';

            // Reset rotation, flips, and transformation
            rotationAngle = 0; // Reset rotation
            horizontalFlip[pieceIndex] = false;
            verticalFlip[pieceIndex] = false;

            // Apply transformations
            applyTransformations(piece, coords, rotationAngle, horizontalFlip[pieceIndex], verticalFlip[pieceIndex]);

            // Reset drag data
            piece.dataset.dragged = 'false';
        }
    }

    function applyTransformations(piece, coords, rotationAngle, horizontalFlip, verticalFlip) {
        const rotatedPieceCoords = rotateCoords(coords, rotationAngle);
        const flippedPieceCoords = applyFlips(rotatedPieceCoords, rotationAngle, horizontalFlip, verticalFlip);

        // Apply transformations to the piece
        for (let i = 0; i < coords.length; i++) {
            const x = coords[i][0] * 50; // Adjust this value based on your piece size
            const y = coords[i][1] * 50; // Adjust this value based on your piece size
            const rotatedX = rotatedPieceCoords[i][0] * 50;
            const rotatedY = rotatedPieceCoords[i][1] * 50;
            const flippedX = flippedPieceCoords[i][0] * 50;
            const flippedY = flippedPieceCoords[i][1] * 50;

            const transform = `translate(${flippedX - rotatedX}px, ${flippedY - rotatedY}px) rotate(${rotationAngle}deg)`;

            piece.style.transform = transform;
        }
    }
 }