window.onload = function () {
  const imageIds = [
    "shape-1", "shape-2", "shape-3", "shape-4", "shape-5", "shape-6",
    "shape-7", "shape-8", "shape-9", "shape-10", "shape-11", "shape-12"
  ];
  let flipflag = 0;
  let rotflag = 1;
  let currentIndex = 0;
  let rotationFlip = 0;
  let rotationAngle = 0;
  let alphabets = ["I", "E", "L", "J", "D", "B", "K", "A", "G", "C", "F", "H"];

  const currentImage = document.getElementById('currentImage');
  const piecesContainer = document.getElementById('piecesContainer');
  const solutionsContainer = document.getElementById('solutionContainer')
  const board = document.getElementById('board');
  const boardMatrix = createBoardMatrix();
  let gridData = Array.from({ length: 5 }, () => Array(11).fill(null));
  let rotationAngles = Array(12).fill(0);
  let rotationFlips = Array(12).fill(0);
  let scaleXY = Array.from({ length: 12 }, () => [1, 1]);
  let initXY = Array.from({ length: 12 }, () => [0, 0]);
  let isMouseMoveListenerAdded = Array(12).fill(false);
  const gameState = new Array();
  gameState.push(JSON.parse(JSON.stringify(gridData))); // Push initial state
  let gridColor = ["#2F922C", "#672598", "#0A8286", "#9C3A3A", "#A0A125", "#9B108E", "#9A5835", "#223A21", "#191A92", "#946D98", "#256191", "#A0A467"];
    let pieces = [
        [[0, -1], [0, 0], [0, 1],
            [1, -1], [1, 1]],

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
    let pieceFlip = new Array(12).fill(0)
//    let horizontalFlip = new Array(12).fill(false)
//    let verticalFlip = new Array(12).fill(false)

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
        const transform = `rotate(${rotationAngle}deg) scaleX(${rotationFlip === 180 ? -1 : 1}) scaleY(${rotationFlip === 90 ? -1 : 1})`;
        currentImage.src = `/static/polysphere_app/images/shapes/${imageIds[currentIndex]}.png`;
        currentImage.style.transform = transform;
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
        flipflag = 0;
        rotflag = 1;
        rotationAngle = (rotationAngle + 90) % 360;
        pieceRotation[currentIndex]  = rotationAngle;
        updateImage();
    }

    function rotateCounterclockwise() {
        flipflag = 0;
        rotflag = 1;
        rotationAngle = (rotationAngle - 90 + 360) % 360;
        pieceRotation[currentIndex] = rotationAngle;
        updateImage();
    }

    function flipHorizontal() {
        flipflag = 1;
        rotflag = 0;
        console.log("Before Flip",rotationFlip)
        rotationFlip = (rotationFlip === 0) ? 180 : 0; // Set to 180 for horizontal flip
        //rotationFlip = (rotationFlip >= 90) ? 90 : 0;
        pieceFlip[currentIndex] = rotationFlip;
        console.log("After Flip",rotationFlip)
        applyCurrentTransformations(); // Apply current transformations to the image
    }

    function flipVertical() {
        flipflag = 1;
        rotflag = 0;
        rotationFlip = (rotationFlip === 0) ? 90 : 0; // Set to 90 for vertical flip
        pieceFlip[currentIndex] = rotationFlip;
        applyCurrentTransformations(); // Apply current transformations to the image
    }

    function applyCurrentTransformations() {
        const transform = `rotate(${rotationAngle}deg) scaleX(${rotationFlip === 180 ? -1 : 1}) scaleY(${rotationFlip === 90 ? -1 : 1})`;
        currentImage.src = `/static/polysphere_app/images/shapes/${imageIds[currentIndex]}.png`;
        currentImage.style.transform = transform;
    }
//    function applyCurrentTransformations() {
//        let transform = `rotate(${rotationAngle}deg)`;
//        if (horizontalFlip[currentIndex]) {
//            transform += ' scaleX(-1)';
//        }
//        if (verticalFlip[currentIndex]) {
//            transform += ' scaleY(-1)';
//        }
//        currentImage.style.transform = transform;
//    }
    // Get buttons from template
    const previousImageButton = document.getElementById('previousImageButton');
    const nextImageButton = document.getElementById('nextImageButton');
    const rotateClockwiseButton = document.getElementById('rotateClockwise');
    const rotateCounterclockwiseButton = document.getElementById('rotateCounterclockwise');
    const resetbrd = document.getElementById('resetBoard');
    const solvePuzzleButton = document.getElementById('solveButton')
    const flipHorizontalButton = document.getElementById('flipHorizontal');
    const flipVerticalButton = document.getElementById('flipVertical');
    const undoButton = document.getElementById('undoButton');

    // Add event listeners for button functions
    previousImageButton.addEventListener('click', previousImage);
    nextImageButton.addEventListener('click', nextImage);
    rotateClockwiseButton.addEventListener('click', rotateClockwise);
    rotateCounterclockwiseButton.addEventListener('click', rotateCounterclockwise);
    resetbrd.addEventListener('click', resetBoard);
    flipHorizontalButton.addEventListener('click', flipHorizontal);
    flipVerticalButton.addEventListener('click', flipVertical);
    undoButton.addEventListener('click', undoAction);
    solveButton.addEventListener('click', (event) => {
        sendPartialConfiguration(gridData);
});

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
        //piecesContainer.appendChild(piece);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        // Updates the rotation state of the piece being dragged
        const pieceId = event.target.id.replace('piece-', 'shape-')
        const pieceIndex = imageIds.indexOf((pieceId));
        pieceRotation[pieceIndex] = rotationAngle; //Here we are adding rotation angle. Likewise, add flip as well
        pieceFlip[pieceIndex] = rotationFlip;
    }

      function drop(event) {
            event.preventDefault();
            const cell = event.target;
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            //console.log("Rotation index & Rotation index", pieceRotation[currentIndex], pieceFlip[currentIndex]);
            //console.log("Rotation Angle & Rotation flip", rotationAngle, rotationFlip);
            console.log("ROT & FLIP", rotflag, flipflag);
        if(rotflag === 1 && flipflag === 0) {
            console.log("Passing rotated piece");
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
                        gridData[newRow][newCol] = alphabets[currentIndex]; //Returns the same alphabet as the currentIndex of the piece.
                    }
                    console.log("Grid -->", gridData)
                    // Deep copies the current gamestate to the variable
                    gameState.push(JSON.parse(JSON.stringify(gridData)));
                    console.log("GameState:" + gameState + "GridData:" + gridData);
                    console.log(gameState);
                }
            }


        }
        else if(flipflag === 1 && rotflag === 0 ){
            console.log("Passing flipped piece");
            const transformedFlipPieceCoords = transformFlipCoords(pieces[currentIndex], currentIndex);
            console.log("Flipped coords",transformedFlipPieceCoords);
            // Check if the cells for the new piece are unoccupied
            if (isSpaceAvailable(row, col, transformedFlipPieceCoords)) {
                // Iterate through the coordinates of the current piece
                for (const coord of transformedFlipPieceCoords) {
                    const newRow = row + coord[0];
                    const newCol = col + coord[1];

                    // Color the cell based on the piece coordinates
                    const targetCell = document.querySelector(`.cell[data-row="${newRow}"][data-col="${newCol}"]`);
                    targetCell.style.backgroundColor = gridColor[currentIndex];
                    // Update the board matrix with the color information
                    gridData[newRow][newCol] = alphabets[currentIndex]; //Returns the same alphabet as the currentIndex of the peice.
                    }
                console.log("Grid -->", gridData)

                // Deep copies the current gamestate to the variable
                gameState.push(JSON.parse(JSON.stringify(gridData)));
                console.log("GameState:" + gameState + "GridData:" + gridData);
                console.log(gameState);

            }
        }

      }

    function isSpaceAvailable(startRow, startCol, pieceCoords) {
        for (const coord of pieceCoords) {
            const newRow = startRow + coord[0];
            const newCol = startCol + coord[1];

            // Check if the new coordinates are within the board bounds
            if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 11) {
                return false;
            }

            // Checks if piece has already been placed
            if(pieceExistsInGrid(alphabets, gridData, currentIndex)){
                alert("Piece has already been placed, try another!")
                return false;
            }

            // Check if the cell is already occupied
            if (gridData[newRow][newCol] !== null) {
                return false;
            }
        }
        return true;
    }

    function pieceExistsInGrid(alphabets, gridData, index) {
    let pieceToFind = alphabets[index];
    console.log(pieceToFind)
    for (let row = 0; row < gridData.length; row++) {
        for (let col = 0; col < gridData[row].length; col++) {
            if (gridData[row][col] === pieceToFind) {
                return true;
            }
        }
    }
    return false;
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

        // Then apply flip
        if (pieceFlip[index] === 180) {
            rotatedCoords = rotatedCoords.map(coord => [-coord[0], coord[1]]);
        } else if (pieceFlip[index] === 90) {
            rotatedCoords = rotatedCoords.map(coord => [coord[0], -coord[1]]);
        }

        return rotatedCoords;
    }

    function transformFlipCoords(coords, index) {
        console.log("Flip func called");
    // First apply flips
        return coords.map(coord => {
            let [x, y] = coord;
            switch (pieceFlip[index]) {
                case 90:
                    return [-x, y];
                case 180:
                    return [x, -y];
                default:
                    return [x, y];
            }
        ;
    })
    }

//    function applyFlips(coords, index) {
//        return coords.map(coord => {
//           let[x,y] = coord;
//           switch ()
//        })
//        let transformedCoords = coords;
//        if (horizontalFlip[index]) {
//            transformedCoords = transformedCoords.map(coord => [-coord[0], coord[1]]);
//        }
//        if (verticalFlip[index]) {
//            transformedCoords = transformedCoords.map(coord => [coord[0], -coord[1]]);
//       }
//        return transformedCoords;
//   }

//    function flipCoordsHorizontally(coords) {
//        return coords.map(coord => [-coord[0], -coord[1]]); // Placeholder logic
//    }

//    function flipCoordsVertically(coords) {
//        return coords.map(coord => [-coord[0], -coord[1]]); // Placeholder logic
//    }

    function resetBoard() {
        console.log("Grid data..", gridData);
        // Clear the board colors and data
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

                // Check if cell is not null before accessing its style
                if (cell) {
                    cell.style.backgroundColor = '#BCF4FA';
                    gridData[row][col] = null;
                }
            }
        }

//        gridData = JSON.parse(JSON.stringify(initialSetupData));
        // Resets the gameState
        gameState.length = 0;
        gameState.push(JSON.parse(JSON.stringify(gridData))); // Push initial stat

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
            rotationFlip = 0;

            // Apply transformations
            applyTransformations(piece, coords, rotationAngle, rotationFlip);

            // Reset drag data
            piece.dataset.dragged = 'false';


        }


    }

    // Function to apply transformations to the piece
    function applyTransformations(piece, coords, rotationAngle, rotationFlip) {
        const transformedPieceCoords = transformCoords(coords, rotationAngle);
        const flippedPieceCoords = transformFlipCoords(coords, rotationFlip);

        // Apply transformations to the piece
        const transformedCoords = (rotationFlip === 0) ? transformedPieceCoords : flippedPieceCoords;

        for (let i = 0; i < transformedCoords.length; i++) {
            const x = transformedCoords[i][0] * 50; // Adjust this value based on your piece size
            const y = transformedCoords[i][1] * 50; // Adjust this value based on your piece size;

            const transform = `translate(${x}px, ${y}px) rotate(${rotationAngle}deg) scaleX(${rotationFlip === 180 ? -1 : 1}) scaleY(${rotationFlip === 90 ? -1 : 1})`;

            piece.style.transform = transform;
        }
    }

    function sendPartialConfiguration(gridData){
        while (solutionContainer.firstChild) {
            solutionContainer.removeChild(solutionContainer.firstChild);
        }

        // Sends Partial configuration to the backend
        fetch('/polysphere/solutions/find_partial_solutions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(gridData, function(key, value) {
        // Replace null with a space
            if (value === null) {
                return " ";
            }
                return value;
        })
    })
        // Parse the json data
        .then(response => response.json())
        .then(configuration => {
            console.log(configuration.img_paths);
            if(configuration.img_paths.length >= 1){
                addImagesToContainer(configuration.img_paths);
                }
            else{
                let message = document.createElement('h1');
                message.textContent = "No Solutions Found! Try Again!";
                message.class = "NoSolutionsFoundMessage"
                solutionContainer.appendChild(message);

            }
        });
    }

    // Gets the csrf token from the html
    function getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    function addImagesToContainer(img_paths) {
        // Assuming solutionContainer is the container where you want to display the images
        //const solutionContainer = document.getElementById('yourSolutionContainerId'); // Replace with your actual container id

        // Clear existing content
        while (solutionContainer.firstChild) {
            solutionContainer.removeChild(solutionContainer.firstChild);
        }

        // Create a grid container
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');

        // creating a new variable ocisBaseUrl for bucket image url location
        const ocisBaseUrl = 'https://objectstorage.uk-london-1.oraclecloud.com/p/7mXVKuuztKQtXs89MrBOgEqnKAr35oP3iNNADoK0CaHldiuftVu16MnlalBelQia/n/lryugqbopb6d/b/thepercyj/o/media/';
        // For each image, create a grid item and add it to the grid container
        img_paths.forEach(path => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.style.marginRight = '10px'; // Adjust the margin-right value as needed

            const img = document.createElement('img');
//            img.src = "../../../media/" + path;
            img.src = ocisBaseUrl + path; // using bucket to fetch image files
            img.alt = path;
            img.classList.add("solutionImage");
            img.classList.add("hidden");

            // Append the image to the grid item
            gridItem.appendChild(img);

            // Append the grid item to the grid container
            gridContainer.appendChild(gridItem);
        });

        // Append the grid container to the solutionContainer
        solutionContainer.appendChild(gridContainer);

        showNextImages();
    }

    function showNextImages() {
        let images = document.querySelectorAll('#yourSolutionContainerId .solutionImage');
        for (let i = 0; i < images.length && i < 5; i++) {
            images[i].classList.remove('hidden');
        }
    }

    function setupLevel1(initialState1) {
        console.log('Setting up Level 1');
        // Apply the predefined solution to the board
        applyPredefinedSolution1(initialState1);
    }
    function setupLevel2(initialState2) {
        console.log('Setting up Level 2');
        // Apply the predefined solution to the board
        applyPredefinedSolution2(initialState2);
    }
    function setupLevel3(initialState3) {
        console.log('Setting up Level 3');
        // Apply the predefined solution to the board
        applyPredefinedSolution3(initialState3);
    }
    function setupLevel4(initialState4) {
        console.log('Setting up Level 4');
        // Apply the predefined solution to the board
        applyPredefinedSolution4(initialState4);
    }
    function setupLevel5(initialState5) {
        console.log('Setting up Level 5');
        // Apply the predefined solution to the board
        applyPredefinedSolution5(initialState5);
    }

    // Function to apply a predefined solution to the board
    function applyPredefinedSolution1(initialState1) {
        // Clear the board
        clearBoard();

        // Apply the solution to the board
        for (let row = 0; row < initialState1.length; row++) {
            for (let col = 0; col < initialState1[row].length; col++) {
                const cellValue = initialState1[row][col];
                if (cellValue !== null) {
                    const pieceIndex = alphabets.indexOf(cellValue);
                    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    targetCell.style.backgroundColor = gridColor[pieceIndex];
                    gridData[row][col] = alphabets[pieceIndex];
                }
            }
        }

        // Deep copy the current board state to the variable
        gameState.push(JSON.parse(JSON.stringify(gridData)));
    }
    function applyPredefinedSolution2(initialState2) {
        // Clear the board
        clearBoard();

        // Apply the solution to the board
        for (let row = 0; row < initialState2.length; row++) {
            for (let col = 0; col < initialState2[row].length; col++) {
                const cellValue = initialState2[row][col];
                if (cellValue !== null) {
                    const pieceIndex = alphabets.indexOf(cellValue);
                    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    targetCell.style.backgroundColor = gridColor[pieceIndex];
                    gridData[row][col] = alphabets[pieceIndex];
                }
            }
        }

        // Deep copy the current board state to the variable
        gameState.push(JSON.parse(JSON.stringify(gridData)));
    }
    function applyPredefinedSolution3(initialState3) {
        // Clear the board
        clearBoard();

        // Apply the solution to the board
        for (let row = 0; row < initialState3.length; row++) {
            for (let col = 0; col < initialState3[row].length; col++) {
                const cellValue = initialState3[row][col];
                if (cellValue !== null) {
                    const pieceIndex = alphabets.indexOf(cellValue);
                    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    targetCell.style.backgroundColor = gridColor[pieceIndex];
                    gridData[row][col] = alphabets[pieceIndex];
                }
            }
        }

        // Deep copy the current board state to the variable
        gameState.push(JSON.parse(JSON.stringify(gridData)));
    }
    function applyPredefinedSolution4(initialState4) {
        // Clear the board
        clearBoard();

        // Apply the solution to the board
        for (let row = 0; row < initialState4.length; row++) {
            for (let col = 0; col < initialState4[row].length; col++) {
                const cellValue = initialState4[row][col];
                if (cellValue !== null) {
                    const pieceIndex = alphabets.indexOf(cellValue);
                    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    targetCell.style.backgroundColor = gridColor[pieceIndex];
                    gridData[row][col] = alphabets[pieceIndex];
                }
            }
        }

        // Deep copy the current board state to the variable
        gameState.push(JSON.parse(JSON.stringify(gridData)));
    }
    function applyPredefinedSolution5(initialState5) {
        // Clear the board
        clearBoard();

        // Apply the solution to the board
        for (let row = 0; row < initialState5.length; row++) {
            for (let col = 0; col < initialState5[row].length; col++) {
                const cellValue = initialState5[row][col];
                if (cellValue !== null) {
                    const pieceIndex = alphabets.indexOf(cellValue);
                    const targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    targetCell.style.backgroundColor = gridColor[pieceIndex];
                    gridData[row][col] = alphabets[pieceIndex];
                }
            }
        }

        // Deep copy the current board state to the variable
        gameState.push(JSON.parse(JSON.stringify(gridData)));
    }

    // Function to clear the board
    function clearBoard() {
        // Clear the board colors and data
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell.style.backgroundColor = '#BCF4FC';
                gridData[row][col] = null;
            }
        }
        // Resets the gameState
        gameState.length = 0;
        gameState.push(JSON.parse(JSON.stringify(gridData))); // Push initial state

    }

    const urlParams = new URLSearchParams(window.location.search);
    const levelParam = urlParams.get('n');
    // Call the setup function when needed, passing the initial state as a parameter
    if (levelParam === '1') {
    setupLevel1([
            ['A', 'A', 'L', 'L', null, null, 'H', 'H', 'G', 'G', 'G'],
            ['A', 'B', 'B', 'L', 'L', null, 'K', 'H', 'H', 'E', 'G'],
            ['A', 'B', 'B', 'L', null, null, 'K', 'K', 'H', 'E', 'G'],
            ['C', 'B', 'D', 'D', 'D', 'D', null, 'K', 'E', 'E', 'F'],
            ['C', 'C', 'C', 'C', 'D', null, null, null, 'E', 'F', 'F']
    ]);
    }
    else if (levelParam === '2'){
    setupLevel2([
            ['F', 'G', 'G', 'G', 'C', 'C', 'C', 'C', null, null, null],
            ['F', 'F', null, 'G', 'B', 'B', 'B', 'C', null, null, null],
            ['A', 'A', null, 'G', null, 'B', 'B', null, null, null, 'J'],
            ['A', null, null, null, null, 'K', 'K', 'D', null, 'J', 'J'],
            ['A', null, null, null, 'K', 'K', 'D', 'D', 'D', 'D', 'J']
    ]);
    }

    else if (levelParam === '3') {
    setupLevel3([
            [null, 'E', 'J', 'J', 'J', null, null, 'D', 'D', 'D', 'D'],
            [null, 'E', 'E', 'J', 'H', 'H', null, null, 'D', null, null],
            [null, null, 'E', null, null, 'H', 'H', 'L', 'I', 'I', null],
            [null, null, 'E', null, null, null, 'H', 'L', 'L', 'I', null],
            [null, null, null, null, null, null, 'L', 'L', 'I', 'I', null]
    ]);
    }

    else if (levelParam === '4') {
    setupLevel4([
            [null, null, null, null, null, null, null, 'L', 'L', null, null],
            [null, null, null, null, null, null, 'L', 'L', null, null, null],
            [null, null, null, null, 'J', 'J', 'J', 'L', 'I', 'I', 'I'],
            [null, null, null, null, null, 'J', null, null, 'I', 'D', 'I'],
            [null, null, null, null, null, null, null, 'D', 'D', 'D', 'D'],
    ]);
    }
    else if (levelParam === '5') {
    setupLevel5([
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
    ]);
    }

    document.addEventListener('DOMContentLoaded', function () {
    const imageGrid = document.getElementById('imageGrid');
    const numberOfImages = 80443;

    urlParams = new URLSearchParams(window.location.search);
    levelParam = urlParams.get('n');


    if (levelParam === '1') {
        setupLevel1([
            ['A', 'A', 'L', 'L', null, null, 'H', 'H', 'G', 'G', 'G'],
            ['A', 'B', 'B', 'L', 'L', null, 'K', 'H', 'H', 'E', 'G'],
            ['A', 'B', 'B', 'L', null, null, 'K', 'K', 'H', 'E', 'G'],
            ['C', 'B', 'D', 'D', 'D', 'D', null, 'K', 'E', 'E', 'F'],
            ['C', 'C', 'C', 'C', 'D', null, null, null, 'E', 'F', 'F']
        ]);
    }
     if (levelParam === '2') {
        setupLevel2([
            ['F', 'G', 'G', 'G', 'C', 'C', 'C', 'C', null, null, null],
            ['F', 'F', null, 'G', 'B', 'B', 'B', 'C', null, null, null],
            ['A', 'A', null, 'G', null, 'B', 'B', null, null, null, 'J'],
            ['A', null, null, null, null, 'K', 'K', 'D', null, 'J', 'J'],
            ['A', null, null, null, 'K', 'K', 'D', 'D', 'D', 'D', 'J']
        ]);
    }
     if (levelParam === '3') {
        setupLevel3([
            [null, 'E', 'J', 'J', 'J', null, null, 'D', 'D', 'D', 'D'],
            [null, 'E', 'E', 'J', 'H', 'H', null, null, 'D', null, null],
            [null, null, 'E', null, null, 'H', 'H', 'L', 'I', 'I', null],
            [null, null, 'E', null, null, null, 'H', 'L', 'L', 'I', null],
            [null, null, null, null, null, null, 'L', 'L', 'I', 'I', null]
        ]);
    }
     if (levelParam === '4') {
        setupLevel4([
            [null, null, null, null, null, null, null, 'L', 'L', null, null],
            [null, null, null, null, null, null, 'L', 'L', null, null, null],
            [null, null, null, null, 'J', 'J', 'J', 'L', 'I', 'I', 'I'],
            [null, null, null, null, null, 'J', null, null, 'I', 'D', 'I'],
            [null, null, null, null, null, null, null, 'D', 'D', 'D', 'D'],
        ]);
    }
     if (levelParam === '5') {
        setupLevel5([
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null]
        ]);
    }

    for (let i = 0; i <= numberOfImages; i++) {
        const imageElement = document.createElement('img');
        imageElement.src = `/polysphere/media/solution_${i}.webp` // Adjust the path based on your file structure
        imageElement.alt = `Image ${i}`;

        if (i % 4 === 1) {
            // Start a new row for every 4 images
            const gridRow = document.createElement('div');
            gridRow.classList.add('grid-row');
            imageGrid.appendChild(gridRow);
        }

        const currentRow = imageGrid.lastElementChild;
        currentRow.appendChild(imageElement);
    }
});

    function undoAction() {
        console.log("Undo clicked. gameState length before pop:", gameState.length);

        // Determine the current level based on the length of the gameState array
        const currentLevel = gameState.length - 1;

        // Get the initial state for the current level
        const initialLevelState = getInitialLevelState(currentLevel);

        // Count the number of null values in the initial state
        const nullCountInInitialState = countNullValues(initialLevelState);

        if (gameState.length > 1) {
            // Pop the last state
            gameState.pop();

            // Get the current state after pop
            gridData = JSON.parse(JSON.stringify(gameState[gameState.length - 1]));

            // Count the number of null values in the current state
            const nullCountInCurrentState = countNullValues(gridData);

            // Check if the undo should be restricted based on null count
            if (nullCountInCurrentState >= nullCountInInitialState) {
                console.log("Undo restricted. Reached initial state for level:", currentLevel);
                alert("Cannot undo beyond the initial state for this level!");
            } else {
                console.log("gridData after pop:", gridData);
                updateUI();
            }
        } else {
            gameState.length = 0;
            gameState.push(JSON.parse(JSON.stringify(gridData)));
            alert("There's nothing to undo!");
        }
    }

    // Function to count the number of null values in a 2D array
    function countNullValues(array) {
        return array.flat().filter(value => value === null).length;
    }

    // Function to get the initial state for a specific level
    function getInitialLevelState(level) {
        const levels = [
                [
                    ['A', 'A', 'L', 'L', null, null, 'H', 'H', 'G', 'G', 'G'],
                    ['A', 'B', 'B', 'L', 'L', null, 'K', 'H', 'H', 'E', 'G'],
                    ['A', 'B', 'B', 'L', null, null, 'K', 'K', 'H', 'E', 'G'],
                    ['C', 'B', 'D', 'D', 'D', 'D', null, 'K', 'E', 'E', 'F'],
                    ['C', 'C', 'C', 'C', 'D', null, null, null, 'E', 'F', 'F']
                ],

                [
                    ['F', 'G', 'G', 'G', 'C', 'C', 'C', 'C', null, null, null],
                    ['F', 'F', null, 'G', 'B', 'B', 'B', 'C', null, null, null],
                    ['A', 'A', null, 'G', null, 'B', 'B', null, null, null, 'J'],
                    ['A', null, null, null, null, 'K', 'K', 'D', null, 'J', 'J'],
                    ['A', null, null, null, 'K', 'K', 'D', 'D', 'D', 'D', 'J']
                ],

                [
                    [null, 'E', 'J', 'J', 'J', null, null, 'D', 'D', 'D', 'D'],
                    [null, 'E', 'E', 'J', 'H', 'H', null, null, 'D', null, null],
                    [null, null, 'E', null, null, 'H', 'H', 'L', 'I', 'I', null],
                    [null, null, 'E', null, null, null, 'H', 'L', 'L', 'I', null],
                    [null, null, null, null, null, null, 'L', 'L', 'I', 'I', null]
                ],

                [
                    [null, null, null, null, null, null, null, 'L', 'L', null, null],
                    [null, null, null, null, null, null, 'L', 'L', null, null, null],
                    [null, null, null, null, 'J', 'J', 'J', 'L', 'I', 'I', 'I'],
                    [null, null, null, null, null, 'J', null, null, 'I', 'D', 'I'],
                    [null, null, null, null, null, null, null, 'D', 'D', 'D', 'D'],
                ],

                [
                    [null, null, null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, null, null, null]
                ]
            ];
        return JSON.parse(JSON.stringify(levels[level]));
    }
    function updateUI(){
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 11; col++) {
                const cellValue = gridData[row][col];
            cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            const pieceIndex = alphabets.indexOf(cellValue)
            if (cellValue === null) {
                cell.style.backgroundColor = '#BCF4FC'
            } else {
                // Use pieceIndex to set the appropriate color
                console.log(`Color for piece: ${gridColor[pieceIndex]}`);
            }
        }
    }
}


}

