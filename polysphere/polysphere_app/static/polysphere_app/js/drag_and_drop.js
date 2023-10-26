$(document).ready(function() {

    // Create and append your SVG shapes to the SVG container
    const svgContainer = $('#svg-container');

    // Make game pieces draggable
    $('.game-piece').draggable({
        containment: 'body', // Optional: Restrict dragging within the body
        cursor: 'move', // Optional: Change cursor on drag
        snap: '.grid-cell', // Snap to grid cells
        snapMode: 'inner', // Snap to the center of grid cells
        snapTolerance: 20 // Adjust the tolerance to control snapping behavior
    });

    // Handle the drop event
    $('.grid-cell').droppable({
        accept: '.game-piece',
        drop: function(event, ui) {
            // Get the dragged game piece element
            var droppedPiece = ui.draggable;

            // Find the nearest unoccupied grid cell
            var nearestCell = findNearestUnoccupiedCell($(this));

            // Snap the game piece to the nearest unoccupied cell
            droppedPiece.position({
                of: nearestCell,
                my: 'center',
                at: 'center'
            });

            // Perform game logic based on pieceId and orientation
            // For example, update the game state, check for valid moves, etc.
        }
    });

    // Function to find the nearest unoccupied grid cell
    function findNearestUnoccupiedCell(targetCell) {
        var nearestCell = null;
        var minDistance = Number.MAX_VALUE;

        $('.grid-cell').each(function() {
            var cell = $(this);

            // Check if the cell is unoccupied
            if (!cell.hasClass('occupied')) {
                // Calculate distance between the target cell and the current cell
                var distance = Math.sqrt(
                    Math.pow(targetCell.position().left - cell.position().left, 2) +
                    Math.pow(targetCell.position().top - cell.position().top, 2)
                );

                // Update nearestCell if this cell is closer
                if (distance < minDistance) {
                    nearestCell = cell;
                    minDistance = distance;
                }
            }
        });

        // Mark the nearest cell as occupied
        nearestCell.addClass('occupied');

        return nearestCell;
    }
});
