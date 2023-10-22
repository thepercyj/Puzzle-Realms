window.onload = function () {
    generateEditableChessboard();
}

function changeSize() {
    var n = $('#size').val();
    if (n > 10) {
        alert("The size should be less than or equal to 10");
        window.location.href = '/nqueens/?n=' + 10; // Set default value to 10 if the user tries to use a value above 10
    } else if (n < 4) {
        alert("The size should be greater than or equal to 4");
        window.location.href = '/nqueens/?n=' + 4; // Set default value to 4 if the user tries to use a value below 4
    } else {
        window.location.href = '/nqueens/?n=' + n;
    }
}

function showSolutions() {
    var solution = document.getElementById("solution-container");
    var btn = document.getElementById("solutionBtn");

    // Toggle solutions display
    if (btn.innerHTML == "Show Solutions") {
        btn.innerHTML = "Hide Solutions";
        solution.style.display = "flex";
    } else {
        btn.innerHTML = "Show Solutions";
        solution.style.display = "none";
    }
}

function generateEditableChessboard() {
    var n = $('#size').val();
    var chessboardContainer = document.getElementById('editableChessboard');

    // Clear the existing content
    chessboardContainer.innerHTML = '';

    // Create the chessboard table
    var chessboardTable = document.createElement('table');
    chessboardTable.className = "";
    var q = 0;

    for (var i = 0; i < n; i++) {
        var row = chessboardTable.insertRow(i);
        for (var j = 0; j < n; j++) {
            var cell = row.insertCell(j);

            // Create a queen image element
            var imgElement = document.createElement('img');
            imgElement.src = '/static/nqueens_app/images/queen.png';
            imgElement.style.display = 'none';
            imgElement.style.width = '50px';
            imgElement.style.height = '45px';
            cell.appendChild(imgElement);

            if ((i + j) % 2 == 0) {
                cell.className = "black-edit";
            } else {
                cell.className = "white-edit";
            }

            // Add a click event listener
            cell.addEventListener('click', function () {
                var img = this.querySelector('img');
                if (img.style.display === 'none') {
                    if (q < n) {
                        img.style.display = 'block';
                        q++;
                        var button = document.getElementById("validateBtn");
                        button.disabled = false;
                    } else if (q >= n) {
                        alert("Cannot add more queens than the chessboard size");
                    }
                } else {
                    img.style.display = 'none';
                    var button = document.getElementById("validateBtn");
                    button.disabled = false;
                    q--;
                }
            });
        }
    }

    chessboardContainer.appendChild(chessboardTable);
}

function validate(solutions) {
    var table = document.querySelector('#editableChessboard table');
    var rows = table.getElementsByTagName('tr');
    var displayStatusArray = [];

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
        var rowStatus = [];

        for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            var image = cell.querySelector('img');
            var displayStatus = image.style.display;
            if (displayStatus == 'none') {
                rowStatus.push(0);
            } else {
                rowStatus.push(1);
            }
        }

        displayStatusArray.push(rowStatus); // User-Result variable
    }

    // Function to compare two objects
    function areObjectsEqual(obj1, obj2) {
        return Object.entries(obj1).toString() === Object.entries(obj2).toString();
    }
    // Iterate through all the possible solutions and match with the user's solution
    for (sol of solutions) {
        var result = areObjectsEqual(sol, displayStatusArray); // Calling function to match solution
        if (result === true) {
            solved = true; // Set the flag to true if a solution is found
            break; // Exit the loop if a solution is found
        }
    }
    if (solved) {
        alert("Congratulations on solving the N-Queens Puzzle");
    }
    else {
        alert("Sorry, please try again");
    }
}
