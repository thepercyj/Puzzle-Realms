function changeSize() {
    var size = document.getElementById("size").value;
    var chessboard = document.getElementById("chessboard");
    chessboard.innerHTML = "";

    for (var row = 0; row < size; row++) {
        for (var col = 0; col < size; col++) {
            var square = document.createElement("div");
            square.classList.add("square");
            square.classList.add((row + col) % 2 == 0 ? "white" : "black");

            if (queens && queens[row] == col) {
                var queenImg = document.createElement("img");
                queenImg.src = "{% static 'nqueens_app/images/bQ.png' %}";
                queenImg.alt = "Q";
                square.appendChild(queenImg);
            }

            chessboard.appendChild(square);
        }
    }
}