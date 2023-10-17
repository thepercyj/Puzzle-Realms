function new_board() {
    var num_sq = document.querySelector('#num_sq').value;
    var size_sq = document.querySelector('#size_sq').value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/new_board?num_sq=${num_sq}&size_sq=${size_sq}`, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('chessboard').innerHTML = data.board;
            document.getElementById('sol-num').innerText = data.solution_number;
        } else {
            console.error('Error:', xhr.status);
        }
    };

    xhr.send();
}

function solve() {
    var queens = document.getElementById('num_sq').value; // Get the number of queens
    var size = document.getElementById('size_sq').value;  // Get the size

    var pos = JSON.stringify([...document.getElementById('chessboard').children].slice(-1)[0].children.map(e => parseInt(e.style.left) / parseInt(e.style.width)));
    var solution_number = document.getElementById('sol-num').innerText;

    // Send an AJAX request to Django view 'solve'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/solve?queens=${queens}&size=${size}&pos=${pos}&solution_number=${solution_number}`, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('sol-num').innerText = data.solution_number;
            data.pos.forEach((e, i) => document.getElementById(`q${i}`).style.left = `${e * size}px`);
        } else {
            console.error('Error:', xhr.status);
        }
    };

    xhr.send();
}

    function is_safe(i, j, pos) {
        if (i === 0) return true;

        for (var k = i - 1; k >= 0; k--) {
            if (pos[k] === j || Math.abs(pos[k] - j) === i - k) return false;
        }

        return true;
    }

    function calc_size(num) {
        var s;

        if (window.innerHeight < window.innerWidth) {
            s = Math.round(window.innerHeight / num * 0.7);
        } else {
            s = Math.round(window.innerWidth / num * 0.85);
        }

        document.querySelector('#size_sq').value = s;
    }
