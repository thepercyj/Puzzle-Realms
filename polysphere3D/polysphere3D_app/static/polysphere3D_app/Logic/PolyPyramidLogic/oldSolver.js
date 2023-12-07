let items = {
    'A': [1, 4, 7],
    'B': [1, 4],
    'C': [4, 5, 7],
    'D': [3, 5, 6],
    'E': [2, 3, 6, 7],
    'F': [2, 7],
    'G': [2, 3, 5, 6]
};

let sets = {
    1: new Set(['A', 'B']),
    2: new Set(['E', 'F', 'G']),
    3: new Set(['D', 'E', 'G']),
    4: new Set(['A', 'B', 'C']),
    5: new Set(['C', 'D', 'G']),
    6: new Set(['D', 'E', 'G']),
    7: new Set(['A', 'C', 'E', 'F'])
};

function* solve(X, Y, solution = [], isFourLevel = false, headers = null) {
    if (isFourLevel) {
        let completeSolution = true;
        for (let i of headers.slice(12, headers.length - 1)) {
            if (Object.keys(X).includes(i)) {
                completeSolution = false;
                break;
            }
        }
        if (completeSolution) {
            yield Array.from(solution);
        } else {
            let min_count = Infinity;
            let min_col;
            for (let [key, value] of Object.entries(X)) {
                if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].includes(key)) {
                    continue;
                }
                if (value.size < min_count) {
                    min_count = value.size;
                    min_col = key;
                }
            }
            console.log(min_col);
            for (let row of Array.from(X[min_col])) {
                solution.push(row);
                let cols = select(X, Y, row);
                for (let s of solve(X, Y, solution, isFourLevel, headers)) {
                    yield s;
                }
                deselect(X, Y, row, cols);
                solution.pop();
            }
        }
    } else {
        if (Object.keys(X).length === 0) {
            console.log("solution!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            yield Array.from(solution);
        } else {
            console.log("test");
            let min_count = Infinity;
            let min_col;
            for (let [key, value] of Object.entries(X)) {
                if (value.size < min_count) {
                    min_count = value.size;
                    min_col = key;
                }
            }
            console.log(Object.entries(X));
            for (let row of Array.from(X[min_col])) {
                solution.push(row);
                let cols = select(X, Y, row);
                for (let s of solve(X, Y, solution, isFourLevel, headers)) {
                    yield s;
                }
                deselect(X, Y, row, cols);
                solution.pop();
            }
        }
    }
}

function select(X, Y, r) {
    let cols = [];
    for (let j of Y[r]) {
        for (let i of Array.from(X[j])) {
            for (let k of Y[i]) {
                if (k !== j) {
                    X[k].delete(i);
                }
            }
        }
        cols.push(X[j]);
        delete X[j];
    }
    return cols;
}

function deselect(X, Y, r, cols) {
    for (let j of Y[r].slice().reverse()) {
        X[j] = cols.pop();
        for (let i of Array.from(X[j])) {
            for (let k of Y[i]) {
                if (k !== j) {
                    X[k].add(i);
                }
            }
        }
    }
}

export { items, sets, solve, select, deselect };
