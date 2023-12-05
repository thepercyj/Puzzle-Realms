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

const FourCheck = document.getElementById('isFourCheck');
const NextButton = document.getElementById('onNextButtonClick');
const ClearButton = document.getElementById('onClearButtonClick');
const StopButton = document.getElementById('onStopButtonClick');
const shapeInput = document.getElementById('inputShape');
const scount = document.getElementById('solutionCount');
const solveButton = document.getElementById('onSolveButtonClick');

// Add event listener
solveButton.addEventListener('click', onSolveButtonClick);
shapeInput.addEventListener('keyup', handleKeyUp);
FourCheck.addEventListener('click', onFourLevelCheckChange);
NextButton.addEventListener('click', onNextButtonClick);
ClearButton.addEventListener('click', onClearButtonClick);
StopButton.addEventListener('click', onStopButtonClick);
scount.addEventListener('keyup', solutionCount);

const layerCheckboxes = [];
for (let i = 1; i <= 5; i++) {
    const checkbox = document.getElementById('l'+i);
    checkbox.addEventListener('change', (event) => {
        layerVisible(i, event.target.checked);
    });
    const label = document.getElementById('l'+i+'Label');

    layerCheckboxes.push(checkbox, label);
}

FourCheck.addEventListener('change', (event) => {
        layerVisible(5, !event.target.checked);
    });



function handleKeyUp(event) {
event.target.value = event.target.value.slice(-1).replace(/[^A-La-l]/g, '').toUpperCase();
console.log(event.target.value);    // Console log printing the shape
}

function drawPosition(position) {
// Assuming a canvas with id "pyramidCanvas" is present
const canvas = document.getElementById('panel');
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
renderPyramid();
}


function checkInput(shapes, coords) {
for (let i = 0; i < shapes.length; i++) {
    if (shapeStore[shapes[i]].layout.length !== coords[i].length) {
        // Wrong number of spheres for shape, abort.
        return false;
    }
}
return true;
}

function onFourLevelCheckChange() {
const isFourLevel = !state.isFourLevel;
setState({ isFourLevel }, () => onFourLevelStateChange());
}

function onFourLevelStateChange() {
const l5Checkbox = document.getElementById("l5");

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

function onSolveButton() {
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

const uiTimer = createTimer(() => {
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

function onNextButton() {
const solutions = [...state.solutions];
if (solutions.length > 0) {
    drawPosition(solutions.pop());
}
}

function onClearButton() {
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

function onStopButton() {
setState({ stopExecution: true });
clearInterval(uiTimer);
uiTimer = null;
}

function componentDidMount() {
scene.init(panel);
renderPyramid();
}

function componentWillUnmount() {
scene.dispose();
}

function onInputClick() {
console.log(inputRef.shape.value);
console.log(inputRef.inputX.value);
console.log(inputRef.inputY.value);
console.log(inputRef.inputZ.value);
}



scene.init(panel);
renderPyramid();

export {setSphereColor, worker};
window.worker = worker;

// *********************** unused code will use if required *****************************************************
//    // Assuming you have a simple timer function
//    function createTimer(callback, interval = 1000) {
//    return setInterval(callback, interval);
//    }
//

