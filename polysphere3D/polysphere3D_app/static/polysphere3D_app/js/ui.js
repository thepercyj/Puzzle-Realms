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

function layerVisible(idx, v) {
    console.log("layerVisible " + idx + v);
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

function PolyPyramid() {
    // Equivalent to the constructor
    const state = {
        stopExecution: false,
        solutionCount: 0,
        solutions: [],
        isFourLevel: false,
    };

    const panel = document.createElement('div');
    panel.className = 'panel';
    const shapeInput = document.createElement('input');
    const inputX = document.createElement('input');
    const inputY = document.createElement('input');
    const inputZ = document.createElement('input');
    const solveButton = document.createElement('button');

    // Assign refs to elements
    const refs = {
        shape: shapeInput,
        inputX: inputX,
        inputY: inputY,
        inputZ: inputZ,
    };

    // Add event listener
    solveButton.addEventListener('click', onSolveButtonClick);

    // Append elements to the panel
    panel.appendChild(shapeInput);
    panel.appendChild(inputX);
    panel.appendChild(inputY);
    panel.appendChild(inputZ);
    panel.appendChild(solveButton);

    // Equivalent to drawPosition function
    function drawPosition(position) {
        // Assuming a canvas with id "pyramidCanvas" is present
        const canvas = document.getElementById('pyramidCanvas');
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
    function onSolveButtonClick() {
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

    // Assuming you have a simple timer function
    function createTimer(callback, interval = 1000) {
        return setInterval(callback, interval);
    }
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
// *****************   need to fix from this section just to call IDs on HTML file "hello_world.html"********************
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

    const container1 = document.createElement('div');
    container1.className = 'container';
    bodyElement.appendChild(container1);



    const container2 = document.createElement('div');
    container2.className = 'container';
    container2.style.paddingTop = '10px';

    const row = document.createElement('div');
    row.className = 'row';

    const col1 = document.createElement('div');
    col1.className = 'col';

    const isFourCheck = document.createElement('input');
    isFourCheck.id = 'isFourCheck';
    isFourCheck.type = 'checkbox';
    isFourCheck.addEventListener('change', () => onFourLevelCheckChange());

    const isFourLabel = document.createElement('label');
    isFourLabel.htmlFor = 'isFourCheck';
    isFourLabel.textContent = '4 Level Pyramid';

    const positionInputForm = document.createElement('form');
    positionInputForm.id = 'positionInputForm';
    positionInputForm.style.paddingBottom = '4px';

    //const solveButton = document.createElement('button');
    solveButton.type = 'button';
    solveButton.style.marginLeft = '3px';
    solveButton.style.marginRight = '3px';
    solveButton.textContent = 'Solve';
    solveButton.addEventListener('click', () => onSolveButtonClick());

    const displayNextButton = document.createElement('button');
    displayNextButton.type = 'button';
    displayNextButton.style.marginLeft = '3px';
    displayNextButton.style.marginRight = '3px';
    displayNextButton.textContent = 'Display Next';
    displayNextButton.addEventListener('click', () => onNextButtonClick());

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.style.marginLeft = '3px';
    clearButton.style.marginRight = '3px';
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', () => onClearButtonClick());

    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.style.marginLeft = '3px';
    stopButton.style.marginRight = '3px';
    stopButton.textContent = 'Stop';
    stopButton.addEventListener('click', () => onStopButtonClick());

    const shapeLabel = document.createElement('label');
    shapeLabel.htmlFor = 'inputShape';
    shapeLabel.style.paddingRight = '3px';
    shapeLabel.textContent = 'Shape';


    const solutionCountParagraph = document.createElement('p');
    solutionCountParagraph.textContent = 'Number of solutions: ' + state.solutionCount;

    // Checkboxes for each layer
    const layerCheckboxes = [];
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.createElement('input');
        checkbox.id = 'l' + i;
        checkbox.type = 'checkbox';
        checkbox.defaultChecked = true;
        // checkbox.addEventListener('change', (e) => layerVisible(i, e.target.checked));

        const label = document.createElement('label');
        label.htmlFor = 'l' + i;
        label.textContent = i;

        layerCheckboxes.push(checkbox, label);
    }

    col1.appendChild(isFourCheck);
    col1.appendChild(isFourLabel);
    positionInputForm.appendChild(solveButton);
    positionInputForm.appendChild(displayNextButton);
    positionInputForm.appendChild(clearButton);
    positionInputForm.appendChild(stopButton);
    col1.appendChild(positionInputForm);
    col1.appendChild(shapeLabel);
    col1.appendChild(inputShape);
    col1.appendChild(solutionCountParagraph);
    col1.appendChild(...layerCheckboxes);

    const col2 = document.createElement('div');
    col2.className = 'col';

    const legendRow = document.createElement('div');
    legendRow.className = 'row justify-content-left pt-1';
    legendRow.id = 'legend';
    legendRow.style.paddingLeft = '20px';

    const legendImg = document.createElement('img');
    legendImg.src = `../Images/ShapeLegend.png`;
    legendImg.style.width = '70%';

    legendRow.appendChild(legendImg);
    col2.appendChild(legendRow);

    row.appendChild(col1);
    row.appendChild(col2);
    container2.appendChild(row);

    const mainContainer = document.createElement('div');
    mainContainer.appendChild(container1);
    mainContainer.appendChild(container2);

    document.body.appendChild(mainContainer);

    // Render the panel on the page
    container1.body.appendChild(panel);
// ******************************************************* fix this area *********************************8
}

export {setSphereColor, worker};
window.worker = worker;