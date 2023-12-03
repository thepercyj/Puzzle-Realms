let shape_cols = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7,
    "I": 8,
    "J": 9,
    "K": 10,
    "L": 11
};

function coord_to_col(coord) {
    let out = 12;
    let z_diff = 0;
    let row_length = 0;

    if (coord[2] === 0) {
        z_diff = 0;
        row_length = 5;
    } else if (coord[2] === 1) {
        z_diff = 25;
        row_length = 4;
    } else if (coord[2] === 2) {
        z_diff = 25 + 16;
        row_length = 3;
    } else if (coord[2] === 3) {
        z_diff = 25 + 16 + 9;
        row_length = 2;
    } else {
        z_diff = 25 + 16 + 9 + 4;
        row_length = 1;
    }

    out += z_diff;
    out += row_length * coord[0] + coord[1];
    return out;
}

function shape_to_row(shape) {
    let row = new Array(67);
    for (let i = 0; i < 67; i++) {
        row[i] = 0;
    }
    row[shape_cols[shape.name]] = 1;

    for (let i = 0; i < shape.layout.length; i++) {
        row[coord_to_col(shape.layout[i])] = 1;
    }
    return row;
}

function generate_headers() {
    let headers = [];
    let shape_names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    for (let i of shape_names) {
        headers.push(i);
    }

    for (let z = 0; z < 5; z++) {
        for (let i = 0; i < 5 - z; i++) {
            for (let j = 0; j < 5 - z; j++) {
                headers.push(i.toString() + "," + j.toString() + "," + z.toString());
            }
        }
    }
    return headers;
}

let shapes = [A, B, C, D, E, F, G, H, I, J, K, L];

function get_horizontal_slices() {
    let horizontal_slices = [];
    for (let i = 4; i >= 0; i--) {
        horizontal_slices.push([]);
        for (let x = 0; x < i + 1; x++) {
            for (let y = 0; y < i + 1; y++) {
                horizontal_slices[4 - i].push([x, y, 4 - i]);
            }
        }
    }
    return horizontal_slices;
}

function get_diag_slices() {
    let diag_slices = [[[], [], [], []],
                       [[], [], [], []],
                       [[], [], [], []],
                       [[]]];
    let horiz_slice = get_horizontal_slices();
    let count = 0;

    for (let layer of horiz_slice) {
        let max = Math.sqrt(layer.length) - 1;
        for (let coord of layer) {
            if (max - coord[1] - coord[0] === 3) {
                diag_slices[0][0].push(coord);
            } else if (max - coord[1] - coord[0] === -3) {
                diag_slices[0][2].push(coord);
            } else if (max - coord[1] - coord[0] === 2) {
                diag_slices[1][0].push(coord);
            } else if (max - coord[1] - coord[0] === -2) {
                diag_slices[1][2].push(coord);
            } else if (max - coord[1] - coord[0] === 1) {
                diag_slices[2][0].push(coord);
            } else if (max - coord[1] - coord[0] === -1) {
                diag_slices[2][2].push(coord);
            } else if (max - coord[1] - coord[0] === 0) {
                diag_slices[3][0].push(coord);
            }

            if (coord[1] - coord[0] === 3) {
                diag_slices[0][1].push(coord);
            } else if (coord[1] - coord[0] === -3) {
                diag_slices[0][3].push(coord);
            } else if (coord[1] - coord[0] === 2) {
                diag_slices[1][1].push(coord);
            } else if (coord[1] - coord[0] === -2) {
                diag_slices[1][3].push(coord);
            } else if (coord[1] - coord[0] === 1) {
                diag_slices[2][1].push(coord);
            } else if (coord[1] - coord[0] === -1) {
                diag_slices[2][3].push(coord);
            } else if (coord[1] - coord[0] === 0) {
                diag_slices[3][1].push(coord);
            }
        }
        count += 1;
    }
    return diag_slices;
}

let diag_slices = get_diag_slices();

function convert_rect_coords_to_diags(shape_layout, size) {
    let out = [];

    if (size !== 5) {
        out = new Array(4);
    } else {
        out = new Array(2);
    }

    let diags = diag_slices[size - 2];
    let count = 0;

    for (let diag of diags) {
        let layout = structuredClone(shape_layout);

        for (let i = 0; i < shape_layout.length; i++) {
            if (shape_layout[i][1] - shape_layout[i][0] === 0) {
                layout[i] = diag[shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 1) {
                layout[i] = diag[size + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 2) {
                layout[i] = diag[2 * size - 1 + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 3) {
                layout[i] = diag[3 * size - 3 + shape_layout[i][0]];
            } else if (shape_layout[i][1] - shape_layout[i][0] === 4) {
                layout[i] = diag[4 * size - 6 + shape_layout[i][0]];
            }
        }
        out[count] = layout;
        count += 1;
    }
    return out;
}

function add_row_for_diags_if_valid(problem_mat, shape, size) {
    for (let coord of shape.layout) {
        if (coord[0] > coord[1]) {
            return false;
        }
    }

    let placement_layouts = convert_rect_coords_to_diags(shape.layout, size);

    for (let layout of placement_layouts) {
        problem_mat.push(shape_to_row(new Shape3D(shape.name, layout)));
    }
    return true;
}

let diags = get_diag_slices();

function add_rows_for_shape_in_horizontal_and_vertical_slices(prob_mat, shape) {
    let max_size = 0;

    for (let i of shape.layout) {
        if (i[0] > max_size) {
            max_size = i[0];
        }
        if (i[1] > max_size) {
            max_size = i[1];
        }
    }

    for (let size = 5; size >= max_size; size--) {
        for (let coord of shape.layout) {
            coord[2] = 5 - size;
        }

        let starting_pos_store = [];
        let rotation_count = 0;

        while (true) {
            let skip = false;

            for (let starting_layout of starting_pos_store) {
                if (shape.equal_layouts(starting_layout)) {
                    skip = true;
                }
            }

            if (!skip) {
                starting_pos_store.push(shape.layout);

                for (let row = 0; row < size; row++) {
                    let place_count = 0;

                    if (shape.translate(row, 0, size)) {
                        for (let col = 0; col < size; col++) {
                            if (col === 0) {
                                place_count += 1;
                                prob_mat.push(shape_to_row(shape));
                                add_row_for_diags_if_valid(prob_mat, shape, size);
                            } else if (shape.translate(0, 1, size)) {
                                place_count += 1;
                                prob_mat.push(shape_to_row(shape));
                                add_row_for_diags_if_valid(prob_mat, shape, size);
                                if (col === size - 1) {
                                    shape.reset_coord();
                                }
                            } else {
                                shape.reset_coord();
                                break;
                            }
                        }
                    }
                }
            }

            if (rotation_count < 4) {
                shape.rotate();
                rotation_count += 1;
            } else if (rotation_count === 4) {
                shape.flip();
                rotation_count += 1;
            } else if (rotation_count > 4 && rotation_count < 8) {
                shape.rotate();
                rotation_count += 1;
            } else {
                break;
            }
        }
    }
    return prob_mat;
}

function populate_problem_matrix3D() {
    let problem_matrix = [];

    for (let shape of shapes) {
        add_rows_for_shape_in_horizontal_and_vertical_slices(problem_matrix, shape);
    }
    return problem_matrix;
}

function reduce_problem_matrix(problem_matrix, problem_headers, shapes_used, squares_used, isFourLevel) {
    console.log(problem_headers);
    let used_cols = [];

    for (let shape of shapes_used) {
        used_cols.push(shape_cols[shape]);
    }

    for (let squares of squares_used) {
        for (let square of squares) {
            console.log(square);
            used_cols.push(problem_headers.indexOf(square.toString()));
        }
    }

    let used_cols_sorted = new Uint8Array(used_cols);
    used_cols_sorted = used_cols_sorted.sort();
    used_cols_sorted = used_cols_sorted.reverse();
    console.log(used_cols_sorted);

    for (let i = problem_matrix.length - 1; i >= 0; i--) {
        for (let j of used_cols_sorted) {
            if (problem_matrix[i][j] && used_cols_sorted.includes(j)) {
                problem_matrix.splice(i, 1);
                break;
            } else if (used_cols_sorted.includes(j)) {
                problem_matrix[i].splice(j, 1);
            }
        }
    }

    for (let i of used_cols_sorted) {
        problem_headers.splice(i, 1);
    }

    if (isFourLevel) {
        for (let i = 36 - shapes_used.length - squares_used.length; i >= 12 - shapes_used.length; i--) {
            for (let j = problem_matrix.length - 1; j >= 0; j--) {
                if (problem_matrix[j][i] === 1) {
                    problem_matrix.splice(j, 1);
                }
            }
        }

        for (let i = 36 - shapes_used.length - squares_used.length; i > 11 - shapes_used.length; i--) {
            for (let j = problem_matrix.length - 1; j >= 0; j--) {
                problem_matrix[j].splice(i, 1);
            }
        }

        console.log(problem_headers);
        problem_headers.splice(12 - shapes_used.length, 25);
    }
    return [problem_matrix, problem_headers];
}