/**
 * Converts a solution format to a pyramid layers format.
 * 
 * @param {number[]} solution - The solution format to convert.
 * @param {number[][]} problem_matrix - The problem matrix.
 * @param {string[]} mat_header - The matrix header.
 * @param {string[]} start_shapes - The starting shapes.
 * @param {number[][][]} start_squares - The starting squares.
 * @returns {number[][][]} The converted pyramid layers format.
 */
function convert_to_pyramid_layers(solution, problem_matrix, mat_header, start_shapes, start_squares) {
    let num_unused_shapes = 12 - start_shapes.length;
    let out_mat = new Array(5);

    for (let i = 0; i < 5; i++) {
        out_mat[i] = new Array(5 - i);
        out_mat[i].fill(0);
    }

    for (let layer = 0; layer < 5; layer++) {
        for (let row = 0; row < 5 - layer; row++) {
            out_mat[layer][row] = new Array(5 - layer);
            out_mat[layer][row].fill(0);
        }
    }

    for (let i = 0; i < start_shapes.length; i++) {
        let shape = start_shapes[i];
        for (let j = 0; j < start_squares[i].length; j++) {
            let coord = start_squares[i][j];
            out_mat[coord[2]][coord[0]][coord[1]] = shape;
        }
    }

    for (let i = 0; i < solution.length; i++) {
        let selected_row = problem_matrix[solution[i]];
        let shape = "";

        for (let j = 0; j < problem_matrix[0].length; j++) {
            if (selected_row[j] === 0) {
                continue;
            } else if (j < num_unused_shapes) {
                shape = mat_header[j];
            } else {
                let coord = mat_header[j].split(",");
                out_mat[parseInt(coord[2])][parseInt(coord[0])][parseInt(coord[1])] = shape;
            }
        }
    }

    return out_mat;
}

// Export the function
export {convert_to_pyramid_layers};