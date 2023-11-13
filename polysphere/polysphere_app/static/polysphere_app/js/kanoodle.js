window.onload = function () {
    // Set up the image IDs and current index
    const imageIds = ["shape-1", "shape-2", "shape-3", "shape-4", "shape-5", "shape-6", "shape-7", "shape-8", "shape-9", "shape-10", "shape-11", "shape-12"];
    let currentIndex = 0;
    let rotationAngle = 0;

    const currentImage = document.getElementById('currentImage');
    const piecesContainer = document.getElementById('piecesContainer');
    const board = document.getElementById('board');
    const boardMatrix = createBoardMatrix();

    let scaleXY = [[1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
    let initXY = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    let isMouseMoveListenerAdded = [false, false, false, false, false, false, false, false, false, false, false, false];
    let gridData = [
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null]
    ];
    let gridColor = ["#2F922C", "#672598", "#0A8286", "#9C3A3A", "#A0A125", "#9B108E", "#9A5835", "#223A21", "#191A92", "#946D98", "#256191", "#A0A467"];
let pieces = [
        [[0,-1],[0,0],[0,1],
         [1,-1],     [1,1]],

        [              [0,0],[0,1],
         [1,-2],[1,-1],[1,0]],

        [       [-1,0],
         [0,-1],[0,0],
                [1,0],[1,1]],

        [      [-1,0],
         [0,-1],[0,0],[0,1]],

        [       [-1,0],
         [0,-1],[0,0],[0,1],[0,2]],

        [       [0,0],[0,1],
         [1,-1],[1,0],[1,1]],

        [       [0,0],[0,1],
         [1,-1],[1,0]],

        [[0,0],[0,1],
         [1,0],
         [2,0]],

        [[0,-2],[0,-1],[0,0],
                       [1,0],
                       [2,0]],

        [[-1,0],
         [0,0],[0,1],[0,2],[0,3]],

        [[-1,0],
         [0,0],[0,1]],

        [[-1,-1],[-1,0],
                 [0,0],[0,1],
                       [1,1]],

]

    // Stores the orientation and flip status of the pieces
    let pieceRotation = new Array(12).fill(0)
    let horizontalFlip = new Array(12).fill(false)
    let verticalFlip = new Array(12).fill(false)

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
        pieceRotation[currentIndex]  = rotationAngle
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
    const rotateCounterclockwiseButton = document.getElementById('rotateCounterclockwise');
    const flipHorizontalButton = document.getElementById('flipHorizontal');
    const flipVerticalButton = document.getElementById('flipVertical');

    previousImageButton.addEventListener('click', previousImage);
    nextImageButton.addEventListener('click', nextImage);
    rotateClockwiseButton.addEventListener('click', rotateClockwise);
    rotateCounterclockwiseButton.addEventListener('click', rotateCounterclockwise);
    flipHorizontalButton.addEventListener('click', flipHorizontal);
    flipVerticalButton.addEventListener('click', flipVertical);

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
        console.log("Rotations ->" , pieceRotation);
        console.log("Vertical flips ->",verticalFlip);
        console.log("Horizontal flips ->", horizontalFlip);
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (cell.classList.contains('cell')) {
            const transformedPieceCoords = transformCoords(pieces[currentIndex], currentIndex);

            // Check if the cells for the new piece are unoccupied
            if (isSpaceAvailable(row, col, transformedPieceCoords)) {
                // Iterate through the coordinates of the current piece
                for (const coord of transformedPieceCoords) {
                    const newRow = row + coord[0];
                    const newCol = col + coord[1];

                    // Color the cell based on the piece coordinates
                    const targetCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                    targetCell.style.backgroundColor = gridColor[currentIndex];
                    // Update the board matrix with the color information
                    gridData[newRow][newCol] = gridColor[currentIndex];
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

    function transformCoords(coords, index) {
    // First apply rotation
        let rotatedCoords = coords.map(coord => {
            let [x, y] = coord;
            switch (pieceRotation[index]) {
                case 90:
                    return [y, -x];
                case 180:
                    return [-x, -y];
                case 270:
                    return [-y, x];
                default:
                    return [x, y];
            }
        });

    // Then apply flips
    console.log(horizontalFlip[index])
    if (horizontalFlip[index]) {
        rotatedCoords = flipHorizontalCoords(rotatedCoords);
    }
    if (verticalFlip[index]) {
        rotatedCoords = flipVerticalCoords(rotatedCoords);
    }
    return rotatedCoords;
}

    function flipHorizontalCoords(coords) {
        return coords.map(([x, y]) => [-x, y]);
    }

    function flipVerticalCoords(coords) {
        coords = coords.map(([x, y]) => [-x, -y]);
        return flipHorizontalCoords(coords)

    }
}
