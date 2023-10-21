window.onload = function() {
            generateEditableChessboard();
        }

function changeSize() {
    var n = $('#size').val();
    if(n > 15){
        alert("The size should be less than or equal to 15");
    }else{
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
            });
        }
    }

    chessboardContainer.appendChild(chessboardTable);
}

function validate(){
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

        displayStatusArray.push(rowStatus);
    }

    console.log(displayStatusArray)
    alert(displayStatusArray);
    // add validate logic here

//    return displayStatusArray;
}