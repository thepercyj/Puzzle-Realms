let rotationAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let scaleXY = [[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]];
let initXY = [[746,82],[989,82],[1232,82],[1475,82],
              [746,325],[989,325],[1232,325],[1451,312],
              [722,555],[989,568],[1232,568],[1451,555]];
let cursorOriginXY = [[[854,123],[1118,130],[1338,139],[1580,165],
                      [834,404],[1090,359],[1332,362],[1578,339],
                      [890,583],[1027,651],[1314,650],[1582,625]]];
let gridData = [[null,null,null,null,null,null,null,null, null,null,null,null],
                [null,null,null,null,null,null,null,null, null,null,null,null],
                [null,null,null,null,null,null,null,null, null,null,null,null],
                [null,null,null,null,null,null,null,null, null,null,null,null],
                [null,null,null,null,null,null,null,null, null,null,null,null]]

let gridColor = ["#2F922C", "#672598", "#0A8286", "#9C3A3A", "#A0A125", "#9B108E", "#9A5835", "#223A21", "#191A92", "#946D98", "#256191", "#A0A467"]
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




window.onload = function() {
    // Step 1: Display all pieces

    // Get the container where you want to display the pieces
    var piecesContainer = document.getElementById('piecesContainer');

    // Define an array of image information
    const images = [
      {
        src: "/static/polysphere_app/images/anticlockwise.svg",
        class: "corner-image bottom-left",
        alt: "Bottom Left"
      },
      {
        src: "/static/polysphere_app/images/mirror-lr.svg",
        class: "corner-image top-left",
        alt: "Top Left"
      },
      {
        src: "/static/polysphere_app/images/clockwise.svg",
        class: "corner-image bottom-right",
        alt: "Bottom Right"
      },
      {
        src: "/static/polysphere_app/images/mirror-ud.svg",
        class: "corner-image top-right",
        alt: "Top Right"
      }
    ];

    // Define an array of icons

    for (let i = 1; i < 13; i++) {

        // Create a new container for each piece
        var container = document.createElement('div');
        container.className = 'container';
        container.id = "container-"+i;

        // Add the center image to the container
        const center = document.createElement('img');
        center.src = "/static/polysphere_app/images/shapes/shape-" + i + ".png";
        center.alt = "Center Image";
        center.className = "center-image";
        center.id = "piece-" + i;

        center.draggable = false;

        // Add corner images to the container
        images.forEach((imageInfo) => {
            const image = document.createElement('img');
            image.className = imageInfo.class;
            image.src = imageInfo.src;
            image.addEventListener('click', function() {
                switch(imageInfo.alt){
                    case "Bottom Left":
                        rotateAntiClock(i)
                        break;
                    case "Top Left":
                        mirrorLR(i)
                        break;
                    case "Bottom Right":
                        rotateClock(i)
                        break;
                    case "Top Right":
                        mirrorUD(i)
                        break;
                    default:

                        break;
                }
            });
            image.setAttribute('center-id', i);

            image.draggable = false;
            container.appendChild(image);
        });

        container.appendChild(center);

        piecesContainer.appendChild(container);

        let isDragging = false;

        center.addEventListener("mousedown", onMouseDown);

        function onMouseDown(e) {
            isDragging = true;

            offsetX = e.clientX - center.getBoundingClientRect().left;
            offsetY = e.clientY - center.offsetTop;

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }

        function onMouseMove(e) {
            if (isDragging) {
                let unknownOffsetY = 12;
                let y = e.clientY - offsetY;
                center.style.top = (y - unknownOffsetY) + 'px';

                let unknownOffsetX = 632 + ((center.id.split("-")[1] - 1) % 4) * 280;
                let x = e.clientX - offsetX - unknownOffsetX;

                center.style.left = x + 'px';
            }
        }

        function onMouseUp(e) {
            isDragging = false;

            console.log("up");

            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            var mouseX = e.clientX;
            var mouseY = e.clientY;

            var piecesGrid = document.getElementById("piecesGrid");

            var piecesGridRect = piecesGrid.getBoundingClientRect();

            var isInsidePiecesGrid = (
                mouseX > piecesGridRect.left &&
                mouseX < piecesGridRect.right &&
                mouseY > piecesGridRect.top &&
                mouseY < piecesGridRect.bottom
            );

            if (isInsidePiecesGrid) {
                console.log(mouseX,mouseY)
                // get the row and column
                let columnIndex = parseInt((mouseY - 342) / 46);
                let rowIndex = parseInt((mouseX - 52) / 46)


                console.log("Mouse is inside piecesGrid. Position (columnIndex, rowIndex):", columnIndex, rowIndex);



                if(setPieceToGrid(i, columnIndex, rowIndex)){
                    document.getElementById(center.id).style.display = "none"
                }

            }
            // Unable to fix the bugs
//            else{
//                console.log("Mouse is outside piecesGrid. Position (left, top):", mouseX, mouseY);
//                center.style.left = initXY[i-1][0] + "px";
//                center.style.left = initXY[i-1][1] + "px";
//            }
        }


    }
    // adjust pieces' size accordingly

    document.getElementById("piece-8").style.width = "256px";
    document.getElementById("piece-8").style.height = "144px";

    document.getElementById("piece-9").style.width = "256px";
    document.getElementById("piece-9").style.height = "144px";

    document.getElementById("piece-12").style.width = "256px";
    document.getElementById("piece-12").style.height = "144px";

    // Add cells' doubleClick event
    for (let i = 0; i < 11; i++) {
        for (let j = 0; j < 5; j++) {
            // Construct the id based on the loop indices
            let elementId = "circle" + j + "-" + i;

            // Get the element with the constructed id
            let targetElement = document.getElementById(elementId);

            // Check if the element exists
            if (targetElement) {
                // Add a double-click event listener to the element
                targetElement.addEventListener("dblclick", function (event) {
                    // Check if it's a left mouse button double-click event
                    if (event.button === 0) {
                        // Regular expression to match integers
                        var regex = /(\d+)-(\d+)/;

                        // Use the exec method to match the regular expression against the input string
                        var match = regex.exec(targetElement.id);

                        rowId = parseInt(match[1]);
                        colmunId = parseInt(match[2]);
                        console.log(rowId, colmunId);

                        let pieceType = gridData[rowId][colmunId];
                        if(pieceType != null){
                            // 1. remove the cells with the same type

                            // 2. reset the pieces.
                        }

                    }
                });
            }
        }
    }


}




function hasMouseMoveListener(element) {
    var listeners = getEventListeners(element);
    return listeners && listeners.mousemove && listeners.mousemove.length > 0;
}

function rotateClock(id) {
    rotationAngle[id - 1] = (rotationAngle[id - 1] + 90) % 360;
    setPiece(id);
    pieces[id-1] = pieces[id-1].map(coords => [coords[1], -coords[0]]);
    console.log(pieces[id-1]);
}

function rotateAntiClock(id) {
    rotationAngle[id - 1] = (rotationAngle[id - 1] + 270) % 360;
    setPiece(id);
    pieces[id-1] = pieces[id-1].map(coords => [-coords[1], coords[0]]);
    console.log(pieces[id-1]);
}

function mirrorLR(id) {
    scaleXY[id - 1][0] *= -1;
    setPiece(id);
    pieces[id-1] = pieces[id-1].map(coords => [coords[0], -coords[1]]);
    console.log(pieces[id-1]);
}

function mirrorUD(id) {
    scaleXY[id - 1][1] *= -1;
    setPiece(id);
    pieces[id-1] = pieces[id-1].map(coords => [-coords[0], coords[1]]);
    console.log(pieces[id-1]);
}


function setPiece(id) {
    piece = document.getElementById("piece-" + id);
    angles = rotationAngle[id - 1];
    scaleX = scaleXY[id - 1][0];
    scaleY = scaleXY[id - 1][1];
    if(angles % 180 == 0){
        piece.style.transform = "translate(-50%, -50%) rotate(" + angles + "deg)" +
                                "scaleX(" + scaleX + ") " +
                                "scaleY(" + scaleY + ") ";
    }else{
        piece.style.transform = "translate(-50%, -50%) rotate(" + angles + "deg)" +
                                "scaleX(" + scaleY + ") " +
                                "scaleY(" + scaleX + ") ";
    }
}

function setPieceDrag(piece) {
    id = piece.id.split("-")[1]
    angles = rotationAngle[id - 1];
    scaleX = scaleXY[id - 1][0];
    scaleY = scaleXY[id - 1][1];
    if(angles % 180 == 0){
        piece.style.transform = "translate(-50%, -50%) rotate(" + angles + "deg)" +
                                "scaleX(" + scaleX + ") " +
                                "scaleY(" + scaleY + ") ";
    }else{
        piece.style.transform = "translate(-50%, -50%) rotate(" + angles + "deg)" +
                                "scaleX(" + scaleY + ") " +
                                "scaleY(" + scaleX + ") ";
    }
}

function setPieceToGrid(id, row, column){

    let piece = pieces[id-1]
    console.log(piece)
    // row, column is the index of the grid

    for (let i = 0; i < piece.length; i++) {
        // example: [[-1,0],[0,0],[1,0],
        //           [-1,-1],     [1,-1]],
        let pieceRow = piece[i][0] + row;
        let pieceColumn = piece[i][1] + column;
//        console.log("pos:",pieceRow,pieceColumn)
        // Check if the piece is within the grid boundaries
        if (pieceRow < 0 || pieceRow >= gridData.length || pieceColumn < 0 || pieceColumn >= gridData[0].length) {
            return false;  // Piece is out of bounds
        }

        // Check if the grid cell is already occupied
        if (gridData[pieceRow][pieceColumn] != null) {
            return false;  // Piece overlaps with existing block
        }
    }
    for (let i = 0; i < piece.length; i++) {
        let pieceRow = piece[i][0] + row;
        let pieceColumn = piece[i][1] + column;
        // Place the piece in the grid
        gridData[pieceRow][pieceColumn] = String.fromCharCode('A'.charCodeAt(0) + id - 1);
        document.getElementById("circle"+pieceRow+"-"+pieceColumn).style.backgroundColor = gridColor[id-1];
    }
    return true;  // Piece successfully placed in the grid
}


function validate() {
    // Check for null in the gridData
    for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[i].length; j++) {
            if (gridData[i][j] === null) {
                // If null is found
                alert("You answer is not correct!");
                return false;
            }
        }
    }
    // If no null is found, display "Congratulations" alert
    alert("Congratulations! You've solved a Kanoodle Puzzle!");
    return true;
}

function showSolutions(){
    alert("look at console.log to get the data form u would like")
    console.log("The current grid is:", gridData);
    let nullValue = "-";//

    console.log(gridData);

    let dataString = "";

    for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[i].length; j++) {
            let cellValue = gridData[i][j];
            if(cellValue == null){
                cellValue = nullValue;
            }
            dataString += cellValue;
        }
    }

    console.log("Or u guys prefer this form:", dataString)
}