let rotationAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let scaleXY = [[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]]
let initXY = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
let isMouseMoveListenerAdded = [false,false,false,false,false,false,false,false,false,false,false,false];
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
        center.style.cursor =  "grab";
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

        // drag event
        let isDragging = false;

        if(!isMouseMoveListenerAdded[i-1]){

            center.addEventListener("mousedown", (e) => {
                isDragging = true;

                offsetX = e.clientX - center.getBoundingClientRect().left;
                offsetY = e.clientY - center.offsetTop;  // Use center.offsetTop instead of center.getBoundingClientRect().top
                if(!isMouseMoveListenerAdded[i-1]){
                    center.addEventListener("mousemove", (e) => {
                        if (isDragging) {
                            let unknownOffsetY = 12;
                            let y = e.clientY - offsetY;
                            center.style.top = (y - unknownOffsetY) + 'px';  // Fix the subtraction

                            let unknownOffsetX = 632 + ((center.id.split("-")[1] - 1) % 4) * 280;
                            let x = e.clientX - offsetX - unknownOffsetX;

                            center.style.left = x + 'px';
        //                    console.log(center.style.top, center.style.left);
                        }
                    });

                    center.addEventListener("mouseup", (e) => {
                        isDragging = false;

                        // get the position of mouse
                        var mouseX = e.clientX;
                        var mouseY = e.clientY;

                        var piecesGrid = document.getElementById("piecesGrid"); // 请确保 piecesGrid 元素有一个 ID

                        var piecesGridRect = piecesGrid.getBoundingClientRect();

                        var isInsidePiecesGrid = (
                            mouseX > piecesGridRect.left &&
                            mouseX < piecesGridRect.right &&
                            mouseY > piecesGridRect.top &&
                            mouseY < piecesGridRect.bottom
                        );

                        if (isInsidePiecesGrid) {
                            console.log("Mouse is inside piecesGrid. Position (left, top):", mouseX, mouseY);
                            // get the row and column
                            let columnIndex = parseInt((mouseY - 302) / 46);
                            let rowIndex = parseInt((mouseX - 120) / 46)


                            const [PiecesSetToGrid, gridData] = setPieceToGrid(i, columnIndex, rowIndex);
                            if(PiecesSetToGrid){
                                document.getElementById(center.id).style.display = "none"
                            }

                        }else{
                            // unable to fix the related bugs now
//                            console.log("Mouse is outside piecesGrid. Position (left, top):", mouseX, mouseY);
//                            center.style.left = initXY[i-1][0] + "px";
//                            center.style.left = initXY[i-1][1] + "px";
//                            console.log(initXY)

                        }
                    });
                    isMouseMoveListenerAdded[i-1] = true;
                }
            });
        }
    }
    // get pieces init position
    for(let i=1;i<13;i++){
        center = document.getElementById("piece-"+i);
        initXY[i-1][0] = center.getBoundingClientRect().left;
        initXY[i-1][1] = center.getBoundingClientRect().top;
    }

    //Adding Event Listener for button click Solve
    $("#btn-third").click(function () {
            // Get the JavaScript variable (Partial configuration)
            const [PiecesSetToGrid, gridData] = setPieceToGrid(i, columnIndex, rowIndex);
            var partial_configuration = gridData;

            if (partial_configuration) {
            // Send AJAX request
            $.ajax({
                type: "POST",
                url: "{% url 'my_django_view' %}",  // Replace with the actual URL of your Django view
                data: {'myData': JSON.stringify(partial_configuration)},  // Convert list to JSON string
                dataType: 'json',
                success: function (result) {
                    // Handle the result returned from the Django view. Here we take the output of the get_partial_solutions function
                    console.log(result);
                },
                error: function (error) {
                    console.log(error);
                }
            });
            } else {
                console.log("please provide some partial configuration")
            }
        });
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

function setPieceToGrid(id,row, column){

    let piece = pieces[id-1]
    console.log(piece)
    // row, column is the index of the grid

    for (let i = 0; i < piece.length; i++) {
        // example: [[-1,0],[0,0],[1,0],
        //           [-1,-1],     [1,-1]],
        let pieceRow = piece[i][0] + row;
        let pieceColumn = piece[i][1] + column;
        console.log("pos:",pieceRow,pieceColumn)
        // Check if the piece is within the grid boundaries
        if (pieceRow < 0 || pieceRow >= gridData.length || pieceColumn < 0 || pieceColumn >= gridData[0].length) {
            return false;  // Piece is out of bounds
        }

        // Check if the grid cell is already occupied
        if (gridData[pieceRow][pieceColumn] != null) {
            return false;  // Piece overlaps with existing block
        }

        // Place the piece in the grid
        gridData[pieceRow][pieceColumn] = String.fromCharCode('A'.charCodeAt(0) + id - 1);
        document.getElementById("circle"+pieceRow+"-"+pieceColumn).style.backgroundColor = gridColor[id-1];
    }
    console.log(gridData);

    return true, gridData;  // Piece successfully placed in the grid
}
