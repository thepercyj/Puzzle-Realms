import Scene, { inputShapes, inputCoords } from "../js/scene.js"
import Pyramid from '../js/pyramid.js'
import { convert_to_pyramid_layers } from "../Logic/PolyPyramidLogic/ConvertSolutionFormat.js";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "../Logic/PolyPyramidLogic/Generate_problem_matrix3D.js";
import { create_dicts } from "../Logic/PolyPyramidLogic/Create_dict_objects.js";
import { solve } from "../Logic/PolyPyramidLogic/Solver.js";
import { shapeStore } from "../Logic/PolyPyramidLogic/Shapes3D.js";
//import Legend from '../Images/ShapeLegend.png';


class PolyPyramid {
    constructor() {
        // Initialize properties
        this.panel = document.getElementById('panel'); // This should be a reference to a DOM element, e.g., document.getElementById('panel')
        this.shape = document.createElement('shape');
        this.inputX = document.createElement('inputX');
        this.inputY = document.createElement('inputY');
        this.inputZ = document.createElement('inputZ')

        const shapeInput = document.getElementById('inputShape');
        const inputX = document.createElement('inputX');
        const inputY = document.createElement('inputY');
        const inputZ = document.createElement('inputZ');
        const solveButton = document.getElementById('onSolveButtonClick');

        // Add event listener
        solveButton.addEventListener('click', onSolveButtonClick);
        shapeInput.addEventListener('keyup', handleKeyUp);
    };
    function handleKeyUp(event) {
        event.target.value = event.target.value.slice(-1).replace(/[^A-La-l]/g, '').toUpperCase();
        console.log(event.target.value);    // Console log printing the shape
    }
    const layerCheckboxes = [];
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById('l'+i);
        checkbox.addEventListener('change', (event) => {
            layerVisible(i, event.target.checked);
        });
        const label = document.getElementById('l'+i+'Label');

        layerCheckboxes.push(checkbox, label);
    }
    // Append elements to the panel
    panel.appendChild(shapeInput);
    panel.appendChild(inputX);
    panel.appendChild(inputY);
    panel.appendChild(inputZ);
    panel.appendChild(solveButton);

    // Equivalent to drawPosition function
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


        const mainContainer = document.getElementById('mainContainer');
        mainContainer.appendChild(container1);
        mainContainer.appendChild(container2);

        document.body.appendChild(mainContainer);



}