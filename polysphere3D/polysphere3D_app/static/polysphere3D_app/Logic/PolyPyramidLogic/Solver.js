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

function* solve(X, Y, solution = []) {
    if (Object.keys(X).length === 0) {
        yield Array.from(solution);
    } else {
        let min_count = Infinity;
        let min_col;

        for (let [key, value] of Object.entries(X)) {
            if (value.size < min_count) {
                min_count = value.size;
                min_col = key;
            }
        }

        for (let row of Array.from(X[min_col])) {
            solution.push(row);
            let cols = cover(X, Y, row);
            for (let s of solve(X, Y, solution)) {
                yield s;
            }
            uncover(X, Y, row, cols);
            solution.pop();
        }
    }
}

function cover(X, Y, r) {
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

function uncover(X, Y, r, cols) {
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

export function dlx(items, sets) {
    let X = {};
    let Y = {};
    let solution = [];
    let headers = Object.keys(items).concat(Object.keys(sets));

    for (let i = 1; i <= Object.keys(items).length; i++) {
        X[i] = new Set(items[headers[i - 1]]);
    }

    for (let j = 1; j <= Object.keys(sets).length; j++) {
        Y[j] = Array.from(sets[headers[Object.keys(items).length + j - 1]]);
    }

    return solve(X, Y, solution);
}

//// Example usage:
//for (let solution of dlx(items, sets)) {
//    console.log(solution);
//}

export { items, sets, solve };