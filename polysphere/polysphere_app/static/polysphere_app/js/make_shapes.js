const shapes = [
    // Shape 1
    [
        [1, 1, 1],
        [1, 0, 1]
    ],
    
    // Shape 2
    [
        [0, 0, 1, 1],
        [1, 1, 1, 0]
    ],
    
    // Shape 3
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    
    // Shape 4
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    
    // Shape 5
    [
        [0, 1, 0, 0],
        [1, 1, 1, 1]
    ],
    
    // Shape 6
    [
        [0, 1, 1],
        [1, 1, 1] 
    ],
    
    // Shape 7
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    
    // Shape 8
    [
        [1, 1],
        [1, 0],
        [1, 0]
    ],
    
    // Shape 9
    [
        [1, 1, 1],
        [0, 0, 1],
        [0, 0, 1]
    ],
    
    // Shape 10
    [
        [1, 0, 0, 0],
        [1, 1, 1, 1]
    ],
    
    // Shape 11
    [
        [1, 0],
        [1, 1]
    ],
    
    // Shape 12
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ]
    ]
    
    const colors = ['blue',
    'red',
    'green',
    'orange',
    'purple',
    'yellow',
    'pink',
    'brown',
    'cyan',
    'magenta',
    'lime',
    'teal']

const svgNS = 'http://www.w3.org/2000/svg';


// Function to create and add SVG shapes
function addSVGShape(shapeMatrix, x, y, size, fillColor, pieceNumber) {
    const svgNS = 'http://www.w3.org/2000/svg';
    
    // Calculate the viewBox based on the shapeMatrix dimensions
    const viewBoxWidth = size * shapeMatrix[0].length;
    const viewBoxHeight = size * shapeMatrix.length;
    const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;

    // Create an SVG element
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'game-piece');
    svg.setAttribute('width', viewBoxWidth); // Use percentage width for scalability
    svg.setAttribute('height', viewBoxHeight); // Use percentage height for scalability
    svg.setAttribute('custom-piece', pieceNumber);
    svg.setAttribute('custom-orientation', 1);
    svg.setAttribute('draggable', true);
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet'); // Preserve aspect ratio
    // Add a custom data attribute to store the matrix in JSON format
    svg.setAttribute('data-matrix', JSON.stringify(shapeMatrix));


    // Create SVG rectangles based on the shapeMatrix
    for (let row = 0; row < shapeMatrix.length; row++) {
        for (let col = 0; col < shapeMatrix[row].length; col++) {
            if (shapeMatrix[row][col] === 1) {
                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', col * size);
                rect.setAttribute('y', row * size);
                rect.setAttribute('width', size);
                rect.setAttribute('height', size);
                rect.setAttribute('fill', fillColor);
                rect.setAttribute('stroke', 'black');
                rect.setAttribute('stroke-width', 1);
                svg.appendChild(rect);
            }
        }
    }

    // Adds a shift-click event to rotate the shape
    svg.addEventListener('click', (event) => {
        if(event.shiftKey){
            let matrix = JSON.parse(svg.getAttribute('data-matrix'));

            //Rotates the matrix
            let rotatedMatrix = rotateShape(matrix);
            // Redraws the shape with the rotated matrix
            redrawSVGShape(svg, rotatedMatrix, size, fillColor);
            // Updates the data attribute with the new matrix
            svg.setAttribute('data-matrix', JSON.stringify(rotatedMatrix));
        }
    });


    // Get the SVG container and append the created SVG
    document.body.appendChild(svg);
}

let shapeNumber = 1;
let colorNumber = 0;
let shapeSize = 30;

// Rotates the shapes 90% clockwise
function rotateShape(shapeMatrix) {
    let rotatedShape = [];
    for (let col = 0; col < shapeMatrix[0].length; col++) {
        let newRow = [];
        for (let row = shapeMatrix.length - 1; row >= 0; row--) {
            newRow.push(shapeMatrix[row][col]);
        }
        rotatedShape.push(newRow);
    }
    return rotatedShape;
}

// Adds all the shapes
shapes.forEach((shapeMatrix, index) => {
    const x = index * 50; // Adjust x position for each shape
    const y = 10; // Adjust y position as needed
    addSVGShape(shapeMatrix, x, y, shapeSize, colors[colorNumber], shapeNumber);
    shapeNumber++;
    colorNumber++;
});


// Redraws the SVG shape with the new matrix (for rotations)
function redrawSVGShape(svg, shapeMatrix, size, fillColor) {
    // Clear the existing rectangles
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    // Calculate the new viewBox based on the rotated shapeMatrix dimensions
    const newViewBoxWidth = size * shapeMatrix[0].length;
    const newViewBoxHeight = size * shapeMatrix.length;
    const newViewBox = `0 0 ${newViewBoxWidth} ${newViewBoxHeight}`;

    // Update the viewBox attribute of the SVG
    svg.setAttribute('viewBox', newViewBox);
    svg.setAttribute('width', newViewBoxWidth); // Update the width attribute if necessary
    svg.setAttribute('height', newViewBoxHeight); // Update the height attribute if necessary

    // Recreate SVG rectangles based on the new shapeMatrix
    for (let row = 0; row < shapeMatrix.length; row++) {
        for (let col = 0; col < shapeMatrix[row].length; col++) {
            if (shapeMatrix[row][col] === 1) {
                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', col * size);
                rect.setAttribute('y', row * size);
                rect.setAttribute('width', size);
                rect.setAttribute('height', size);
                rect.setAttribute('fill', fillColor);
                rect.setAttribute('stroke', 'black');
                rect.setAttribute('stroke-width', 1);
                svg.appendChild(rect);
            }
        }
    }
}

