//import React, { useEffect, useState, useRef, createRef } from "react";
import "../css/style.css";
import { Scene, inputShapes, inputCoords } from "../js/scene";
import Pyramid from '../js/pyramid'
import { convert_to_pyramid_layers } from "../Logic/PolyPyramidLogic/ConvertSolutionFormat";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "../Logic/PolyPyramidLogic/Generate_problem_matrix3D";
import { create_dicts } from "../Logic/PolyPyramidLogic/Create_dict_objects";
import { solve } from "../Logic/PolyPyramidLogic/Solver";
import { shapeStore } from "../Logic/PolyPyramidLogic/Shapes3D.js";
import Legend from '../Images/ShapeLegend.png';

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

function PyramidLayer(size, matrix) {
    this.size = size;
    this.matrix = matrix || [];

    this.fill = function (matrix) {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                this.matrix[i][j].color = matrix[i][j];
    };

    this.set = function (x, y, color) {
        this.matrix[x][y].color = color;
    };

    this.get = function (x, y) {
        return this.matrix[x][y];
    };
}

/*function Pyramid(layersNum, sphereRadius = 1) {
    this.layers = [];

    this.radius = function () {
        return sphereRadius;
    };

    this.getLayer = function (layer) {
        return this.layers[layersNum - layer];
    };

    this.get = function (layer, x, y) {
        return this.layers[layer].get(x, y).color;
    };

    // Initialize Pyramid object immediately
    this.layers = Array.from({ length: layersNum }, (_, i) => new PyramidLayer(layersNum - i));
}*/

// Vanilla JavaScript equivalent of the React component
function PolyPyramid() {
    let panel = document.createElement("div");
    panel.classList.add("panel");

    let inputRef = {
        shape: document.createElement("input"),
        inputX: document.createElement("input"),
        inputY: document.createElement("input"),
        inputZ: document.createElement("input"),
    };

    PolyPyramid.prototype = {
        onSolveButtonClick: function () {
            this.setState({
                solutionCount: 0,
                solutions: [],
                stopExecution: false,
            });

            input_shapes = inputShapes.get();
            input_squares = inputCoords.get();

            if (!this.checkInput(input_shapes, input_squares)) {
                return;
            }

            problem_mat = populate_problem_matrix3D();
            problem_def = reduce_problem_matrix(
                problem_mat,
                generate_headers(problem_mat),
                input_shapes,
                input_squares,
                this.isFourLevel
            );

            problem_mat = problem_def[0];
            headers = problem_def[1];
            dicts = create_dicts(problem_mat, headers, this.isFourLevel);

            let ret = solve(dicts[0], dicts[1], [], this.isFourLevel, headers);
            let cnt = 0;

            createTimer(() => {
                let arr = ret.next().value;
                console.log(arr);
                if (!arr || this.state.stopExecution) {
                    clearInterval(uiTimer);
                    uiTimer = null;
                    console.log('done');
                    return;
                }
                cnt++;
                this.setState({ solutionCount: cnt });
                let pyramid_layers = convert_to_pyramid_layers(
                    arr,
                    problem_mat,
                    headers,
                    input_shapes,
                    input_squares
                );
                this.setState({ solutions: [...this.state.solutions, pyramid_layers] });
                this.drawPosition(pyramid_layers);
            });
        },

        onNextButtonClick: function () {
            this.drawPosition(this.state.solutions.pop());
        },

        onClearButtonClick: function () {
            inputShapes.clear();
            inputCoords.clear();
            this.setState({
                solutions: [],
                solutionCount: 0,
            });

            let empty_position = new Array(5);
            for (let i = 0; i < 5; i++) {
                empty_position[i] = new Array(5 - i);
                empty_position[i].fill(0);
            }
            this.drawPosition(empty_position);
        },

        onStopButtonClick: function () {
            this.setState({ stopExecution: true });
            clearInterval(uiTimer);
            uiTimer = null;
        },

        onFourLevelCheckChange: function () {
            this.isFourLevel = !this.isFourLevel;
            this.onFourLevelStateChange();
        },

        onFourLevelStateChange: function () {
            if (this.isFourLevel) {
                document.getElementById("l5").checked = false;
                document.getElementById("l5").disabled = true;
                layerVisible(5, false);
                this.onClearButtonClick();
            } else {
                document.getElementById("l5").checked = true;
                document.getElementById("l5").disabled = false;
                layerVisible(5, true);
                this.onClearButtonClick();
            }
        },
    createInputForm: function () {
        let form = document.createElement("form");
        form.id = "positionInputForm";
        form.style.paddingBottom = "4px";

        let solveButton = document.createElement("button");
        solveButton.type = "button";
        solveButton.style.marginLeft = "3px";
        solveButton.style.marginRight = "3px";
        solveButton.textContent = "Solve";
        solveButton.addEventListener("click", () => this.onSolveButtonClick());

        // ... (create and add other buttons similarly)

        let inputShapeLabel = document.createElement("label");
        inputShapeLabel.htmlFor = "inputShape";
        inputShapeLabel.style.paddingRight = "3px";
        inputShapeLabel.textContent = "Shape";

        this.inputRef.shape.id = "inputShape";
        this.inputRef.shape.type = "text";
        this.inputRef.shape.addEventListener("keyup", (e) => {
            e.target.value = e.target.value.replace(/[^A-La-l]/g, '').toUpperCase();
        });
        this.inputRef.shape.defaultValue = "A";

        let solutionsCountParagraph = document.createElement("p");
        solutionsCountParagraph.textContent = "Number of solutions: " + this.state.solutionCount;

        // ... (create and add other input elements similarly)

        form.appendChild(solveButton);
        // ... (append other buttons similarly)
        form.appendChild(inputShapeLabel);
        form.appendChild(this.inputRef.shape);
        form.appendChild(solutionsCountParagraph);

        return form;
    },

    createLayerVisibilityCheckboxes: function () {
        let checkboxesContainer = document.createElement("div");
        checkboxesContainer.classList.add("col");

        for (let i = 1; i <= 5; i++) {
            let checkbox = document.createElement("input");
            checkbox.id = "l" + i;
            checkbox.type = "checkbox";
            checkbox.defaultChecked = true;
            checkbox.addEventListener("change", (e) => layerVisible(i, e.target.checked));

            let label = document.createElement("label");
            label.htmlFor = "l" + i;
            label.textContent = i;

            checkboxesContainer.appendChild(checkbox);
            checkboxesContainer.appendChild(label);
        }

        return checkboxesContainer;
    },

    createLegendContainer: function () {
        let legendContainer = document.createElement("div");
        legendContainer.classList.add("container");

        let legendRow = document.createElement("div");
        legendRow.classList.add("row", "justify-content-left", "pt-1");
        legendRow.id = "legend";
        legendRow.style.paddingLeft = "20px";

        let legendImage = document.createElement("img");
        legendImage.src = Legend; // Assuming Legend is the image source
        legendImage.style.width = "70%";

        legendRow.appendChild(legendImage);
        legendContainer.appendChild(legendRow);

        return legendContainer;
    },

    render: function () {
        let container = document.createElement("div");
        container.classList.add("container");

        let panelContainer = document.createElement("div");
        panelContainer.appendChild(this.panel);

        let inputFormContainer = this.createInputForm();

        let checkboxesContainer = this.createLayerVisibilityCheckboxes();

        let additionalHTML = document.createElement("div");
        additionalHTML.classList.add("col");
        // ... (create and append additional HTML elements)

        let legendContainer = this.createLegendContainer();

        container.appendChild(panelContainer);
        container.appendChild(inputFormContainer);
        container.appendChild(checkboxesContainer);
        container.appendChild(additionalHTML);
        container.appendChild(legendContainer);

        return container;
    },
};
}
// Attach event listeners and other setup logic
document.addEventListener("DOMContentLoaded", () => {
    let polyPyramid = new PolyPyramid();

    // Attach event listeners, append to the DOM, or any other setup logic
    document.getElementById("root").appendChild(polyPyramid.render());
});