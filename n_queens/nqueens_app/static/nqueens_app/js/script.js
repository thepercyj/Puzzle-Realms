window.onload = function() {
            generateEditableChessboard();
        }

function changeSize() {
    var n = $('#size').val();
<<<<<<< HEAD
    if(n > 15){
        alert("The size should be less than or equal to 15");
    }else{
=======
    if(n > 10){ //Restrict user for going above 10 and below 4 chess board size
        alert("The size should be less than or equal to 10");
        window.location.href = '/nqueens/?n=' + 10; // Set default value to 10 as user tries to run for value above 10

    }
    else if(n < 4){
        alert("The size should be greater than or equal to 4");
        window.location.href = '/nqueens/?n=' + 4; // Set default value to 4 as user tries to run for value below 4
    }
    else{
>>>>>>> rohan-276280
        window.location.href = '/nqueens/?n=' + n;
    }
}

function showSolutions() {
    var solution = document.getElementById("solution-container");
    var btn = document.getElementById("solutionBtn");
    // hide solutions
    if (btn.innerHTML == "Show Solutions"){
        btn.innerHTML = "Hide Solutions";
        solution.style.display = "flex";
    }else{
        // Show solutions
        solution.style.display = "none";
        btn.innerHTML = "Show Solutions";
    }
}

function generateEditableChessboard() {
    var n = $('#size').val();

    var chessboardContainer = document.getElementById('editableChessboard');

    // set the current content to empty
    chessboardContainer.innerHTML = '';

    // create a table element
    var chessboardTable = document.createElement('table');
    chessboardTable.className = "";
<<<<<<< HEAD
=======
    var q = 0;

>>>>>>> rohan-276280
    for (var i = 0; i < n; i++) {
        var row = chessboardTable.insertRow(i);
        for (var j = 0; j < n; j++) {
            var cell = row.insertCell(j);

            // create a text node
            var imgElement = document.createElement('img');
            imgElement.src = '/static/nqueens_app/images/queen.png';
            imgElement.style.display = 'none';
            imgElement.style.width = '50px';
            imgElement.style.height = '45px';
<<<<<<< HEAD

            cell.appendChild(imgElement);

            if((i + j) % 2== 0){
                cell.className = "black-edit";
            }else{
                cell.className = "white-edit";
            }

            cell.addEventListener('click', function() {
                var img = this.querySelector('img');
                if (img.style.display === 'none') {
                        img.style.display = 'block';
                    } else {
                        img.style.display = 'none';
                    }
=======
            cell.appendChild(imgElement);

            if ((i + j) % 2 == 0) {
                cell.className = "black-edit";
            } else {
                cell.className = "white-edit";
            }

            cell.addEventListener('click', function () {
                var img = this.querySelector('img');
                if (img.style.display === 'none') {
                    if (q < n ) {
                        img.style.display = 'block';
                        q++;
                    }
                    else if ( q >= n){
                        alert("Cannot add more queens than number of chessboard size");
                    }
                } else {
                    img.style.display = 'none';
                    q--;
                    var button = document.getElementById("validateBtn");
                    button.disabled = true;
                }
                // Here the "validateBtn" button is disabled be default and only user can enable if the number of queens is equal board size else disable the button again
                if (q == n){
                    var button = document.getElementById("validateBtn");
                    button.disabled = false;
                }
>>>>>>> rohan-276280
            });
        }
    }

    chessboardContainer.appendChild(chessboardTable);
}

<<<<<<< HEAD
function validate(){
=======
function validate(solutions){
>>>>>>> rohan-276280
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
            if(displayStatus == 'none'){
                rowStatus.push(0);
            }else{
                rowStatus.push(1);
            }
        }

<<<<<<< HEAD
        displayStatusArray.push(rowStatus);
    }

    console.log(displayStatusArray)
    // alert(displayStatusArray);
    // add validate logic here

    return displayStatusArray;
}
=======
        displayStatusArray.push(rowStatus); //User-Result variable
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
    if (typeof solved !== 'undefined') {
        alert("Congratulations on solving the N-Queens Puzzle");
        delete solved; // Removing the solved variable once success to reset the check condition
    }
    else {
        alert("Sorry, please try again");
    }
}
>>>>>>> rohan-276280
