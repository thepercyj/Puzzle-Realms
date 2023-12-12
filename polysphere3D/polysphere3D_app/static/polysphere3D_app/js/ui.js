////import React, { useEffect, useState, useRef, createRef } from "react";
//import "../css/style.css";
import Scene, { inputShapes, inputCoords, Colours } from "../js/scene.js"
import Pyramid from '../js/pyramid.js'
import { convert_to_pyramid_layers } from "../Logic/PolyPyramidLogic/ConvertSolutionFormat.js";
import { generate_headers, populate_problem_matrix3D, reduce_problem_matrix } from "../Logic/PolyPyramidLogic/Generate_problem_matrix3D.js";
import { create_dicts } from "../Logic/PolyPyramidLogic/Create_dict_objects.js";
import { solve } from "../Logic/PolyPyramidLogic/Solver.js";
import { shapeStore } from "../Logic/PolyPyramidLogic/Shapes3D.js";
import resetFirstPlacementCoord  from "../js/scene.js";
import {
    DodecahedronGeometry, DirectionalLight, MeshLambertMaterial, CylinderGeometry, BoxGeometry, PerspectiveCamera, AmbientLight, PointLightHelper, WebGLRenderer, PointLight,
    SphereGeometry, MeshPhongMaterial, Mesh, PlaneGeometry, Color, PCFSoftShadowMap, Raycaster, Vector2, Vector3, RectAreaLight, AxesHelper
} from "./three.js";
//import Legend from '../Images/ShapeLegend.png';



window.onload = function () {
    const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const imageIds = [
    "shape-1", "shape-2", "shape-3", "shape-4", "shape-5", "shape-6",
    "shape-7", "shape-8", "shape-9", "shape-10", "shape-11", "shape-12"
  ];


    let rotationAngle = 0;
    let rotationAngles = Array(12).fill(0);
    let currentIndex = 0;
    let currentAlphabetIndex = 0;
    let currentImageName = "A"
    currentImage.className = currentImageName

    // Function to update the displayed alphabet
    function updateAlphabet() {
        const alphabetContainer = document.getElementById('currentAlphabet');
        alphabetContainer.textContent = alphabets[currentAlphabetIndex];
    }

    function updateImage() {
        currentImage.src = `/static/polysphere3D_app/images/shapes/${imageIds[currentIndex]}.png`;
        console.log(currentImageName)
        currentImage.className = currentImageName
        currentImage.style.transform = `rotate(${rotationAngle}deg)`;
    }
    function previousImage() {
        currentIndex = (currentIndex - 1 + imageIds.length) % imageIds.length;
        rotationAngle = 0; // Reset rotation when changing images
        updateImage();
        currentAlphabetIndex = (currentAlphabetIndex - 1 + alphabets.length) % alphabets.length;
        updateAlphabet();
    }
     function nextImage() {
        currentIndex = (currentIndex + 1) % imageIds.length;
        rotationAngle = 0; // Reset rotation when changing images
        updateImage();
        currentAlphabetIndex = (currentAlphabetIndex + 1) % alphabets.length;
        updateAlphabet();
    }

    const previousImageButton = document.getElementById('previousImageButton');
    previousImageButton.addEventListener('click', previousImage);
    const nextImageButton = document.getElementById('nextImageButton');
    nextImageButton.addEventListener('click', nextImage);


}
let worker = new Pyramid(5, 1);
let scene = new Scene();
let sol_scene = new Scene();
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


// function setSphereColor(x, y, layer, color) {
//     worker.layers[layer][x][y].color.set(color);
//     console.log("Hi");
//     console.log(worker.layers[layer][x][y].color);
// }

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
    console.log("Layer Visible",idx, v)
    // Updates the visibilityStates to match change
    visibilityStates[idx - 1] = v
    //console.log("New States", visibilityStates)
    let layer = worker.getLayer(idx);
    const spheres = layer.matrix;
    for (let x = 0; x < layer.size; x++) {
        for (let y = 0; y < layer.size; y++) {
            if (spheres[x][y].userData) {
                spheres[x][y].userData.visible = v;
                spheres[x][y].visible = v;
                spheres[x][y].userData.needsUpdate = true;
                //console.log("?");
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

const canvas = document.getElementById('panel');
const sol_canvas = document.getElementById('c');
//const FourCheck = document.getElementById('isFourCheck'); Hiding this function for now because it has no implementation currently
const NextButton = document.getElementById('onNextButtonClick');
const ClearButton = document.getElementById('onClearButtonClick');
const StopButton = document.getElementById('onStopButtonClick');
// const shapeInput = document.getElementById('inputShape');
const scount = document.getElementById('solutionCount');
const solveButton = document.getElementById('onSolveButtonClick');
solveButton.addEventListener('click', onSolveButton);
// shapeInput.addEventListener('keyup', handleKeyUp);
NextButton.addEventListener('click', onNextButton);
ClearButton.addEventListener('click', onClearButton);
StopButton.addEventListener('click', onStopButton);

const layerCheckboxes = [];

//var lowerSlider = document.querySelector("#lower");
//var upperSlider = document.querySelector("#upper");
//var lowerVal = parseInt(lowerSlider.value);
//var upperVal = parseInt(upperSlider.value);
//
//upperSlider.oninput = function () {
//   lowerVal = parseInt(lowerSlider.value);
//   upperVal = parseInt(upperSlider.value);
//
//   if (upperVal < lowerVal + 0) {
//      lowerSlider.value = upperVal - 0;
//
//      if (lowerVal == lowerSlider.min) {
//         upperSlider.value = 0;
//      }
//   }
//   console.log(lowerSlider.value, upperSlider.value);
//};
//
//lowerSlider.oninput = function () {
//   lowerVal = parseInt(lowerSlider.value);
//   upperVal = parseInt(upperSlider.value);
//
//   if (lowerVal > upperVal - 0) {
//      upperSlider.value = lowerVal + 0;
//
//      if (upperVal == upperSlider.max) {
//         lowerSlider.value = parseInt(upperSlider.max) - 0;
//      }
//   }
//   console.log(lowerSlider.value, upperSlider.value);
//};

for (let i = 1; i <= 5; i++) {
    const checkbox = document.getElementById('l'+i);
    checkbox.addEventListener('change', (event) => {
        layerVisible(i, event.target.checked);
    });
    const label = document.getElementById('l'+i+'Label');
    console.log(checkbox, label);
    layerCheckboxes.push(checkbox, label);
}

//FourCheck.addEventListener('change', (event) => {
//        layerVisible(5, !event.target.checked);
//    }); Hiding this function for now because it has no implementation currently


const state = createState();

function createState() {
  return {
    stopExecution: false,
    solutionCount: 0,
    solutions: [],
    isFourLevel: false,
  };
}

function onSolveButton() {
    var allSolutions = [];
    let solutionCount = 0;
    let solutions = [];
    let stopExecution = false;

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
        if (arr == undefined) {
            console.log('done');
            onStopButton();
            return;
        }

        console.log(arr);

        cnt++;
        scount.textContent = "Number of solutions: " + cnt;
        // Push the current pyramid_layers into the array

        const pyramid_layers = convert_to_pyramid_layers(arr, updatedProblemMat, headers, input_shapes, input_squares);
        solutions: [...state.solutions, pyramid_layers];
        allSolutions.push(pyramid_layers); // All solutions
//        console.log("Solve",pyramid_layers)
        drawPosition(pyramid_layers);
    });
}

function onClearButton() {
    var allSolutions = [];
    inputShapes.clear();
    inputCoords.clear();
new resetFirstPlacementCoord()



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

function drawPosition(position) {
    for (let layer = 0; layer < position.length; layer++) {
        for (let i = 0; i < position[layer].length; i++) {
            for (let j = 0; j < position[layer].length; j++) {
                if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].indexOf(position[layer][i][j]) !== -1) {
                    // Set to shape colour
                    worker.getLayer(5 - layer).set(i, j, Colours[position[layer][i][j]]);
                }
                else {
                    // Set to black to indicate empty
                    worker.getLayer(5 - layer).set(i, j, 0x999999);
                }
            }
        }
    }
//    renderPyramid();
}


function checkInput(shapes, coords) {
    console.log("Shapes:",shapes,"Coords:", coords)
for (let i = 0; i < shapes.length; i++) {
    if (shapeStore[shapes[i]].layout.length !== coords[i].length) {
        // Wrong number of spheres for shape, abort.
        return false;
    }
}
return true;
}

function onNextButton() {
    console.log("Clicked next")
const solutions = [...state.solutions];
console.log(state.solutions)
if (solutions.length > 0) {
    drawPosition(solutions.pop());
}
}

function onStopButton() {
let stopExecution = true;
clearInterval(uiTimer);
uiTimer = null;
}

function componentDidMount() {
scene.init(panel);
sol_scene.init2(c);
//renderPyramid();
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

console.log("Component Mounted successfully", panel, c)
scene.init(panel);
sol_scene.init2(c);
//renderPyramid();

export { worker};
window.worker = worker;

// *********************** unused code will use if required *****************************************************
//    // Assuming you have a simple timer function
//    function createTimer(callback, interval = 1000) {
//    return setInterval(callback, interval);
//    }
//


//Solutions Three.js


//var scenes = [], sol_camera, renderer, emptyScene;
//
//var sol_canvas = document.getElementById("c");
//sol_init(c);
//sol_animate();
//
//function sol_init() {
//  //console.log("This is init", sol_canvas)
//  var emptyScene = new Scene();
//  var sol_camera = new PerspectiveCamera( 75, sol_canvas.clientWidth / sol_canvas.clientHeight, 0.1, 100 );
//  sol_camera.position.z = 1.5;
//
//  var geometries = [
//    new BoxGeometry( 1, 1, 1 ),
//    new SphereGeometry( 0.5, 12, 12 ),
//    new DodecahedronGeometry( 0.5 ),
//    new CylinderGeometry( 0.5, 0.5, 1, 12 ),
//  ];
//
//  //var template = document.getElementById("template").text;
//  var content = document.getElementById("content");
//
//
//
//  var numScenes = 100;
//
//  for ( var ii =  0; ii < numScenes; ++ii ) {
//
//    var sol_scene = new Scene();
//
//    // make a list item.
//    var element = document.createElement( "div" );
//    //element.innerHTML = template;
//    element.className = "list-item";
//
//    // Look up the element that represents the area
//    // we want to render the scene
//    sol_scene.element = element.querySelector(".scene");
//    content.appendChild(element);
//
//    // add one random mesh to each scene
//    var geometry = geometries[ geometries.length * Math.random() | 0 ];
//    var material = new MeshLambertMaterial( { color: randColor() } );
//
//    sol_scene.add( new Mesh( geometry, material ) );
//
//    var light = new DirectionalLight( 0xffffff );
//    light.position.set( 0.5, 0.8, 1 );
//    sol_scene.add( light );
//
//    var light = new DirectionalLight( 0xffffff );
//    light.position.set( -0.5, -0.8, -1 );
//    sol_scene.add( light );
//
//    scenes.push( sol_scene );
//  }
//
//
//  renderer = new WebGLRenderer( { canvas: sol_canvas, antialias: true } );
//  renderer.setClearColor( 0xFFFFFF );
//}
//
//function updateSize() {
//
//  var width = sol_canvas.clientWidth;
//  var height = sol_canvas.clientHeight;
//
//  if ( sol_canvas.width !== width || sol_canvas.height != height ) {
//
//    renderer.setSize ( width, height, false );
//
//  }
//
//}
//
//function sol_animate() {
//
//  render();
//
//  requestAnimationFrame( sol_animate );
//}
//
//function render() {
//
//  updateSize();
//
//  sol_canvas.style.transform = `translateY(${window.scrollY}px`;
//
//  renderer.setClearColor( 0xFFFFFF );
//  renderer.clear( true );
//  renderer.setClearColor( 0xE0E0E0 );
//
//  renderer.setScissorTest( true );
//  scenes.forEach( function( scene ) {
//    // so something moves
//    console.log(scene.children);
//    scene.children[0].rotation.x = Date.now() * 0.00111;
//    scene.children[0].rotation.z = Date.now() * 0.001;
//
//    // get the element that is a place holder for where we want to
//    // draw the scene
//    var element = scene.element;
//
//    // get its position relative to the page's viewport
//    var rect = element.getBoundingClientRect();
//
//    // check if it's offscreen. If so skip it
//    if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
//       rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
//      return;  // it's off screen
//    }
//
//    // set the viewport
//    var width  = rect.right - rect.left;
//    var height = rect.bottom - rect.top;
//    var left   = rect.left;
//    var top    = rect.top;
//
//    renderer.setViewport( left, top, width, height );
//    renderer.setScissor( left, top, width, height );
//
//    sol_camera.aspect = width / height;
//    sol_camera.updateProjectionMatrix();
//
//    renderer.render( scene, sol_camera );
//
//  } );
//  renderer.setScissorTest( false );
//
//}
//
//function rand( min, max ) {
//  if ( max == undefined ) {
//    max = min;
//    min = 0;
//  }
//
//  return Math.random() * ( max - min ) + min;
//}
//
//function randColor() {
//  var colors = [ rand( 256 ), rand ( 256 ), rand( 256 ) ];
//  colors[ Math.random() * 3 | 0 ] = 255;
//  return ( colors[0] << 16 ) |
//       ( colors[1] <<  8 ) |
//       ( colors[2] <<  0 ) ;
//}