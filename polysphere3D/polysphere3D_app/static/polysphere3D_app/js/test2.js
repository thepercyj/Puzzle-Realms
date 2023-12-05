////import React, { useEffect, useState, useRef, createRef } from "react";
//import "../css/style.css";
import Scene, { inputShapes, inputCoords } from "../js/scene.js"
import Pyramid from '../js/pyramid.js'
import { convert_to_pyramid_layers } from "../Logic/PolyPyramidLogic/ConvertSolutionFormat.js";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "../Logic/PolyPyramidLogic/Generate_problem_matrix3D.js";
import { create_dicts } from "../Logic/PolyPyramidLogic/Create_dict_objects.js";
import { solve } from "../Logic/PolyPyramidLogic/Solver.js";
import { shapeStore } from "../Logic/PolyPyramidLogic/Shapes3D.js";
//import Legend from '../Images/ShapeLegend.png';

let worker = new Pyramid(5, 1);
let scene = new Scene();
const FPS = 30;
let uiTimer = null;
let visibilityStates = [true, true, true, true, true];
function createTimer(func) {
    if (uiTimer) {
        clearInterval(uiTimer);
        uiTimer = null;
    }

    uiTimer = setInterval(() => {
        func();
    }, 1000 / FPS);
}

window.onbeforeunload = () => {
    if (uiTimer) clearTimeout(uiTimer);
};

const Colours = {
    A: 0xff0000,
    B: 0xff0080,
    C: 0xff99cc,
    D: 0x0000ff,
    E: 0xffff00,
    F: 0xcc6699,
    G: 0x660033,
    H: 0x4dff4d,
    I: 0xe65c00,
    J: 0x006600,
    K: 0xff9900,
    L: 0x00bfff,
};

function setSphereColor(x, y, layer, color) {
    worker.layers[layer][x][y].color.set(color);
    console.log("Hi");
    console.log(worker.layers[layer][x][y].color);
}

function renderPyramid() {
    for (let i = 0; i < worker.layers.length; i++) {
        const spheres = worker.layers[i].matrix;
        for (let x = 0; x < worker.layers[i].size; x++) {
            for (let y = 0; y < worker.layers[i].size; y++) {
                let pos = spheres[x][y].pos;
                let color = spheres[x][y].color;

                if (!spheres[x][y].userData) {
                    spheres[x][y].userData = scene.createSphere(
                        pos[0],
                        pos[1],
                        pos[2],
                        color,
                        worker.radius()
                    );
                    scene.add(spheres[x][y].userData);
                } else {
                    spheres[x][y].userData.material.color.set(color);
                    spheres[x][y].userData.material.specular.set(color);
                }
            }
        }
    }
}

function disposePyramid() {
    for (let i = 0; i < worker.layers.length; i++) {
        const spheres = worker.layers[i].matrix;
        for (let x = 0; x < worker.layers[i].size; x++) {
            for (let y = 0; y < worker.layers[i].size; y++) {
                if (spheres[x][y].userData) {
                    scene.disposeSphere(spheres[x][y].userData);
                }
            }
        }
    }
}

// Makes layers visible
function layerVisible(idx, v) {
    // Updates the visibilityStates to match change
    visibilityStates[idx - 1] = v
    console.log("New States", visibilityStates)
    let layer = worker.getLayer(idx);
    const spheres = layer.matrix;
    for (let x = 0; x < layer.size; x++) {
        for (let y = 0; y < layer.size; y++) {
            if (spheres[x][y].userData) {
                spheres[x][y].userData.visible = v;
                spheres[x][y].visible = v;
                spheres[x][y].userData.needsUpdate = true;
                console.log("?");
            }
        }
    }
}

let input;
let input_shapes;
let input_squares;
let problem_mat;
let problem_def;
let headers;
let dicts;

class PolyPyramid {
    // constructor() {
    //     // Initialize properties
    //     this.panel = document.getElementById('panel'); // This should be a reference to a DOM element, e.g., document.getElementById('panel')
    //     this.inputRef = {
    //         shape: document.createElement('shapeInput'),
    //         inputX: document.createElement('inputX'),
    //         inputY: document.createElement('inputY'),
    //         inputZ: document.createElement('inputZ')
    //     };
    //
    //     this.stopExecution = false;
    //     this.solutionCount = 0;
    //     this.solutions = [];
    //     this.isFourLevel = false;
    //
    //     // Bind methods if necessary
    //     this.onSolveButtonClick = this.onSolveButtonClick.bind(this);
    //     // Bind other methods similarly
    //
    //     // Equivalent to the constructor
    // state = {
    //     stopExecution: false,
    //     solutionCount: 0,
    //     solutions: [],
    //     isFourLevel: false,
    // };
    //
    //     panel = document.querySelector('.panel');
    //     // shapeInput = document.createElement('input');
    //     inputX = document.createElement('input');
    //     inputY = document.createElement('input');
    //     inputZ = document.createElement('input');
    //     solveButton = document.createElement('button');
    //
    //     // Assign refs to elements
    //     refs = {
    //         shape: shapeInput,
    //         inputX: inputX,
    //         inputY: inputY,
    //         inputZ: inputZ,
    //     };

    //     // Add event listener
    //     solveButton.addEventListener('click', onSolveButtonClick);
    //     document.getElementsByTagName("shapeInput")
    //     // Append elements to the panel
    //     panel.appendChild(shapeInput);
    //     panel.appendChild(inputX);
    //     panel.appendChild(inputY);
    //     panel.appendChild(inputZ);
    //     panel.appendChild(solveButton);
    // }


    // Equivalent to drawPosition function
    drawPosition(position) {
        // Assuming a canvas with id "pyramidCanvas" is present
        const canvas = document.getElementById('panel');
        console.log("Printing canvas: " + canvas);
        const context = canvas.getContext('2d');

        for (let layer = 0; layer < position.length; layer++) {
            for (let i = 0; i < position[layer].length; i++) {
                for (let j = 0; j < position[layer].length; j++) {
                    if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].indexOf(position[layer][i][j]) !== -1) {
                        // Set to shape color
                        context.fillStyle = Colours[position[layer][i][j]]; // Assuming Colours is defined
                        context.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
                    } else {
                        // Set to black to indicate empty
                        context.fillStyle = "#233333";
                        context.fillRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
                    }
                }
            }
        }
    }
    checkInput(shapes, coords) {
        for (let i = 0; i < shapes.length; i++) {
            if (shapeStore[shapes[i]].layout.length !== coords[i].length) {
                // Wrong number of spheres for shape, abort.
                return false;
            }
        }
        return true;
    }

    onFourLevelCheckChange() {
        const isFourLevel = !state.isFourLevel;
        setState({ isFourLevel }, () => onFourLevelStateChange());
    }

    onFourLevelStateChange() {
        const l5Checkbox = document.getElementById("l5");
        l5Checkbox.addEventListener('change', (event) => {
            layerVisible(5, event.target.checked);
        });

        if (state.isFourLevel) {
            l5Checkbox.checked = false;
            l5Checkbox.disabled = true;
            layerVisible(5, false);
            onClearButtonClick();
        } else {
            l5Checkbox.checked = true;
            l5Checkbox.disabled = false;
            layerVisible(5, true);
            onClearButtonClick();
        }
    }
    onSolveButtonClick() {
        setState({
            solutionCount: 0,
            solutions: [],
            stopExecution: false
        });

        const input_shapes = inputShapes.get();
        const input_squares = inputCoords.get();

        // If incorrect number of spheres for shape, abort.
        if (!checkInput(input_shapes, input_squares)) {
            return;
        }

        const problem_mat = populate_problem_matrix3D();
        const problem_def = reduce_problem_matrix(problem_mat, generate_headers(problem_mat), input_shapes, input_squares, state.isFourLevel);
        const updatedProblemMat = problem_def[0];
        const headers = problem_def[1];

        console.log(updatedProblemMat);
        console.log(headers);

        const dicts = create_dicts(updatedProblemMat, headers, state.isFourLevel);

        console.log(Object.keys(dicts[0]).length);
        console.log(dicts[0]);
        console.log(dicts[1]);
        console.log(headers);

        const ret = solve(dicts[0], dicts[1], [], state.isFourLevel, headers);
        let cnt = 0;
    }
    uiTimer = createTimer(() => {
        const arr = ret.next().value;
        console.log(arr);

        if (!arr) {
            clearInterval(uiTimer);
            console.log('done');
            return;
        }

        cnt++;
        setState({ solutionCount: cnt });

        const pyramid_layers = convert_to_pyramid_layers(arr, updatedProblemMat, headers, input_shapes, input_squares);
        setState({ solutions: [...state.solutions, pyramid_layers] });
        drawPosition(pyramid_layers);
    });
    }

    // Assuming you have a simple timer function
    // function createTimer(callback, interval = 1000) {
    //     return setInterval(callback, interval);
    // }
    function onNextButtonClick() {
        const solutions = [...state.solutions];
        if (solutions.length > 0) {
            drawPosition(solutions.pop());
        }
    }

    function onClearButtonClick() {
        inputShapes.clear();
        inputCoords.clear();
        setState({
            solutions: [],
            solutionCount: 0
        });

        // Set pyramid to empty and render empty pyramid
        const empty_position = new Array(5);
        for (let i = 0; i < 5; i++) {
            empty_position[i] = new Array(5 - i);
            empty_position[i].fill(0);
        }
        for (let layer = 0; layer < 5; layer++) {
            for (let row = 0; row < 5 - layer; row++) {
                empty_position[layer][row] = new Array(5 - layer);
                empty_position[layer][row].fill(0);
            }
        }
        drawPosition(empty_position);
    }

    function onStopButtonClick() {
        setState({ stopExecution: true });
        clearInterval(uiTimer);
        uiTimer = null;
    }

    // function componentDidMount(panel) {
    //     console.log(panel)
    //     scene.init(panel);
    //     renderPyramid();
    // }
    //
    // function componentWillUnmount() {
    //     scene.dispose();
    // }

    function onInputClick() {
        console.log(inputRef.shape.value);
        console.log(inputRef.inputX.value);
        console.log(inputRef.inputY.value);
        console.log(inputRef.inputZ.value);
    }

    // componentDidMount(panel);
// *****************   need to fix from this section just to call IDs on HTML file "polysphere3d.html"********************
//    var solveButton = document.getElementById('solveButton');
//    solveButton.addEventListener('click', onSolveButtonClick);
//    var displayNextButton = document.getElementById('displayNextButton');
//    solveButton.addEventListener('click', onNextButtonClick);
//    var clearButton = document.getElementById('clearButton');
//    solveButton.addEventListener('click', onClearButtonClick);
//    var stopButton = document.getElementById('stopButton');
//    solveButton.addEventListener('click', onStopButtonClick);
//    var stopButton = document.getElementById('stopButton');
//    solveButton.addEventListener('click', inputShape);

    const container1 = document.getElementById('container1');

    const container2 = document.getElementById('container2');

    const row = document.querySelector('.row');

    const col1 = document.querySelector('.col1');

    const isFourCheck = document.getElementById('isFourCheck');
    isFourCheck.addEventListener('change', (event) => {
        layerVisible(5, event.target.checked);
    });

    const isFourLabel = document.getElementById('isFourLabel');
    const positionInputForm = document.getElementById('positionInputForm');
    const solveButton = document.getElementById('onSolveButtonClick');
    solveButton.addEventListener('click', () => onSolveButtonClick());

    const displayNextButton = document.getElementById('onNextButtonClick');

    displayNextButton.addEventListener('click', () => onNextButtonClick());

    const clearButton = document.getElementById('onClearButtonClick');
    clearButton.addEventListener('click', () => onClearButtonClick());

    const stopButton = document.getElementById('onStopButtonClick');
    stopButton.addEventListener('click', () => onStopButtonClick());

    const shapeInput = document.getElementById('inputShape');
    shapeInput.addEventListener('keyup',handleKeyUp);
    const shapeLabel = document.getElementById('shapeLabel');

    // Handles input in shape
    function handleKeyUp(event) {
    event.target.value = event.target.value.slice(-1).replace(/[^A-La-l]/g, '').toUpperCase();
    console.log(event.target.value);    // Console log printing the shape
    }

    const solutionCountParagraph = document.getElementById('solutionCount');
    // solutionCountParagraph.textContent = 'Number of solutions: ' + state.solutionCount;

    // Checkboxes for each layer
    const layerCheckboxes = [];
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById('l'+i);
        checkbox.addEventListener('change', (event) => {
            layerVisible(i, event.target.checked);
        });
        const label = document.getElementById('l'+i+'Label');

        layerCheckboxes.push(checkbox, label);
    }



    container2.appendChild(row);

    const mainContainer = document.getElementById('mainContainer');
    mainContainer.appendChild(container1);
    mainContainer.appendChild(container2);

    document.body.appendChild(mainContainer);

    // Render the panel on the page
    container1.appendChild(panel);
    scene.init(panel)
// const polyPyramid = new PolyPyramid();
// polyPyramid.initialiseUI();

// ******************************************************* fix this area *********************************8




export {setSphereColor, worker};
window.worker = worker;

