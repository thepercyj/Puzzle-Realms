$(document).ready(function() {
    // Make game pieces draggable
    $('.game-piece').draggable({
        containment: 'body', // Optional: Restrict dragging within the body
        cursor: 'move', // Optional: Change cursor on drag
        snap: '.grid-cell', // Optional: Snap to grid cells (if you have a grid)
        snapMode: 'inner' // Optional: Snap to the center of grid cells
    });

    // Handle the drop event
    $('.grid-cell').droppable({
        accept: '.game-piece',
        drop: function(event, ui) {
            // Get the dragged game piece element
            var droppedPiece = ui.draggable;

            // Get the piece's data attributes
            var pieceId = droppedPiece.data('piece'); // Get the piece ID
            var orientation = droppedPiece.data('orientation'); // Get the orientation

            // Perform game logic based on pieceId and orientation
            // For example, update the game state, check for valid moves, etc.
        }
    });
});