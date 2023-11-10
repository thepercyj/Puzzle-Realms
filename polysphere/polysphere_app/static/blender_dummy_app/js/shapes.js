


document.addEventListener('DOMContentLoaded', function() {
    // Array of colors for the spheres
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

    // Function to create an SVG circle representing a sphere
    function createSVGSphere(svg, cx, r, color) {
        var ns = 'http://www.w3.org/2000/svg';
        var circle = document.createElementNS(ns, 'circle');
        circle.setAttributeNS(null, 'cx', cx);
        circle.setAttributeNS(null, 'cy', '50'); // Center y-coordinate
        circle.setAttributeNS(null, 'r', r);
        circle.setAttributeNS(null, 'fill', color);
        svg.appendChild(circle);
    }

    var svgContainer = document.getElementById('svgContainer');

    // Calculate the spacing based on the number of colors
    var spacing = svgContainer.clientWidth / (colors.length + 1);

    // Create spheres with different colors
    colors.forEach((color, index) => {
        // Position each sphere with equal spacing
        var cx = spacing * (index + 1);
        createSVGSphere(svgContainer, cx, 50, color);
    });
});


