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

    // Get the SVG container and append the created SVG
    document.body.appendChild(svg);
}

let shapeNumber = 1;
let colorNumber = 0;
let shapeSize = 30;
// Adds all the shapes
shapes.forEach((shapeMatrix, index) => {
    const x = index * 50; // Adjust x position for each shape
    const y = 10; // Adjust y position as needed
    addSVGShape(shapeMatrix, x, y, shapeSize, colors[colorNumber], shapeNumber);
    shapeNumber++;
    colorNumber++;
});