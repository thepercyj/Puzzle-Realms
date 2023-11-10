let rotationAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let scaleXY = [[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1],[1,1]]


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
        if((i - 1) % 4 == 0){
            // Create a new row container for every 4 pieces
            var row = document.createElement('div');
            row.className = 'container-wrapper';
            piecesContainer.appendChild(row); // Add the row to the main container
        }

        // Create a new container for each piece
        var container = document.createElement('div');
        container.className = 'container';

        // Add the center image to the container
        const center = document.createElement('img');
        center.src = "/static/polysphere_app/images/shapes/shape-" + i + ".png";
        center.alt = "Center Image";
        center.className = "center-image";
        center.id = "piece-" + i;

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

        // Add the container to the current row
        row.appendChild(container);
    }

}

function rotateClock(id) {
    rotationAngle[id - 1] = (rotationAngle[id - 1] + 90) % 360;
    setPiece(id);
}

function rotateAntiClock(id) {
    rotationAngle[id - 1] = (rotationAngle[id - 1] + 270) % 360;
    setPiece(id);
}

function mirrorLR(id) {
    scaleXY[id - 1][0] *= -1; // Multiply by -1 to toggle between 1 and -1
    setPiece(id);
}

function mirrorUD(id) {
    scaleXY[id - 1][1] *= -1; // Multiply by -1 to toggle between 1 and -1
    setPiece(id);
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