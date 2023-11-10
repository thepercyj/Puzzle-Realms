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
        images.forEach(imageInfo => {
            const image = document.createElement('img');
            image.className = imageInfo.class;
            image.src = imageInfo.src;
            image.alt = imageInfo.alt;
            image.draggable = false;
            container.appendChild(image);

        });

        container.appendChild(center);

        // Add the container to the current row
        row.appendChild(container);
    }
}
