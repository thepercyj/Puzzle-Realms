
/**
 * Solves the given problem using a backtracking algorithm.
 * 
 * @generator
 * @function solve
 * @param {Object} X - The input object containing the problem data.
 * @param {Object} Y - The input object containing the problem constraints.
 * @param {Array} [solution=[]] - The current solution being built.
 * @yields {Array} - The next valid solution found.
 */
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

/**
 * Removes redundant elements from the input set and returns the remaining elements as an array.
 * @param {Object} X - The input set represented as an object.
 * @param {Array} Y - The input set represented as an array.
 * @param {number} r - The index of the element to be covered.
 * @returns {Array} - The remaining elements after removing redundancies.
 */
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

/**
 * Uncover function assigns colors to the vertices of a graph in a specific order.
 * It starts from the last row and assigns colors to the vertices in reverse order.
 * For each vertex, it assigns a color and updates the adjacent vertices' colors.
 * 
 * @param {Array<Set<number>>} X - An array of sets representing the vertices and their assigned colors.
 * @param {Array<Array<number>>} Y - An array of arrays representing the adjacency list of the graph.
 * @param {number} r - The index of the row to start uncovering from.
 * @param {Array<any>} cols - An array of colors to assign to the vertices.
 */
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

/**
 * Solves the exact cover problem using the Dancing Links algorithm.
 * 
 * @param {Object} items - The items to be covered.
 * @param {Object} sets - The sets of items.
 * @returns {Array} - The solution to the exact cover problem.
 */
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

export {solve };