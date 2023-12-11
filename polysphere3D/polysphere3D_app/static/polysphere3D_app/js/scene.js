import { OrbitControls } from "./OrbitControls.js";
import {
    Scene, Vector4, ArrayCamera, MeshLambertMaterial, DirectionalLight, PerspectiveCamera, AmbientLight, PointLightHelper, WebGLRenderer, PointLight, BoxGeometry, DodecahedronGeometry, CylinderGeometry,
    SphereGeometry, MeshPhongMaterial, Mesh, PlaneGeometry, Color, PCFSoftShadowMap, Raycaster, Vector2, Vector3, RectAreaLight, AxesHelper
} from "./three.js";
import { shapeStore } from "../Logic/PolyPyramidLogic/Shapes3D.js";
const scene = new Scene();
const camera = new PerspectiveCamera();
scene.background = new Color("rgb(188,244,250)");
const globalLight = new AmbientLight(0xeeeeee);
scene.add(globalLight);
const light = new PointLight(0xBCF4FA, 15, 0);
light.castShadow = true;
const helper = new PointLightHelper(light, 2);
scene.add(light);
scene.add(helper);
light.intensity = 0.5;
light.position.set(0, 0, 1).normalize();
const renderer = new WebGLRenderer({ antialias: true });
//const sol_renderer = new WebGLRenderer( { antialias: true } );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(0x999999);
renderer.setPixelRatio(window.devicePixelRatio);
let resizeObeserver;
let firstPlacementCoord = null;
let currentShapePlacements = [];

export let inputShapes = {
    get() {
        return this.store;
    },
    add(shape_name) {
        this.store.push(shape_name);
    },
    clear() {
        this.store = [];
    },
    store:[]
};

export let inputCoords = {
    get() {
        return this.store;
    },
    add(coord) {
        this.store.push(coord);
    },
    clear() {
        this.store = [];
    },
    store:[]
};

const Colours = {
    A: 0x228B1E,
    B: 0x6D359A,
    C: 0x1E9195,
    D: 0x931515,
    E: 0xA2A42C,
    F: 0x9F1B92,
    G: 0x904512,
    H: 0x0E2B0C,
    I: 0x272899,
    J: 0x966E9A,
    K: 0x205F90,
    L: 0x9DA15E,
};

export function initScene(canvas) {
    // console.log(canvas)
    //const axesHelper = new AxesHelper( 5 );
    //scene.add( axesHelper );
    camera.fov = 75;
    // camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.near = 0.2;
    camera.far = 300;
    camera.position.z = 18;
    camera.position.x = -0
    camera.position.y = 0;
    camera.addEventListener('onCameraChange', (e) => {
        console.log('change');
    })
    renderer.setSize(canvas.clientWidth, canvas.clientWidth);
    resizeObeserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientWidth);
        })
    });
    resizeObeserver.observe(canvas);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxDistance = 300;

    controls.target = new Vector3(5, 3.8, 5);
    controls.maxPolarAngle = Math.PI / 2;

    function arrayCoordsFromWorldCoords(x, y, height) {
        let layer = Math.round((height - 1) / Math.sqrt(2));
        let x_index;
        let y_index;
        if (layer % 2 === 1) {
            x_index = (x - 1 - 1 * layer) / 2;
            y_index = (y - 1 - 1 * layer) / 2;
        }
        else {
            x_index = (x - 1 - 1 * layer) / 2;
            y_index = (y - 1 - 1 * layer) / 2;
        }
        return [x_index, y_index, layer];
    }

    function setInput (shape, coord) {
        if (!(inputShapes.get().includes(shape))) {
            // Add shape if not already added
            inputShapes.add(shape);
            // Add array for shape coords
            inputCoords.add(new Array(coord));
        }
        else {
            // Add coordinate
            inputCoords.get()[inputShapes.get().indexOf(shape)].push(coord);
        }
    }

    const raycaster = new Raycaster();
    const pointer = new Vector2();


    function onClick(event) {
    const canvasBounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - canvasBounds.left) / canvas.clientWidth) * 2 - 1;
    pointer.y = - ((event.clientY - canvasBounds.top) / canvas.clientHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    let currentShapeElement = document.getElementById("currentImage");
    let shape = currentShapeElement.className;
    let currentShape = shapeStore[shape]
    console.log("Current shape:", shape);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.visible === true && intersects[i].object.name[0] === "s" &&
            intersects[i].object.material.color.equals(new Color(0x999999))) {


            let coord = arrayCoordsFromWorldCoords(intersects[i].object.position.x, intersects[i].object.position.z, intersects[i].object.position.y);
            let shapeIndex = inputShapes.get().indexOf(shape);
            let lastCoord = shapeIndex >= 0 && inputCoords.get()[shapeIndex].length > 0 ? inputCoords.get()[shapeIndex][inputCoords.get()[shapeIndex].length - 1] : null;

            // Check for correct adjacency
            if (!lastCoord ||
                (lastCoord[2] === coord[2] && (Math.abs(lastCoord[0] - coord[0]) + Math.abs(lastCoord[1] - coord[1]) === 1)) || // Same level adjacency
                (Math.abs(lastCoord[2] - coord[2]) === 1 && lastCoord[0] === coord[0] && lastCoord[1] === coord[1])) { // Different level but directly above or below
                if (isPlacementValid(coord, currentShape, lastCoord)) {
                    intersects[i].object.material.color.set(Colours[shape]);
                    setInput(shape, coord);
                    console.log("Placed sphere for shape:", shape, "at coordinates:", coord);
                    firstPlacementCoord = coord;
                    break;
                } else {
                        alert("Invalid placement: Sphere is not correctly adjacent.");
                    }
            }
        }
    }
}


function isPlacementValid(coord, shape, lastCoord) {
    // Check for correct adjacency
    return (
        !lastCoord ||
        (lastCoord[2] === coord[2] && (Math.abs(lastCoord[0] - coord[0]) + Math.abs(lastCoord[1] - coord[1]) === 1)) ||
        (Math.abs(lastCoord[2] - coord[2]) === 1 && lastCoord[0] === coord[0] && lastCoord[1] === coord[1]) ||
        (Math.abs(lastCoord[0] - coord[0]) === 1 && Math.abs(lastCoord[1] - coord[1]) === 1 && lastCoord[2] === coord[2])
    );
}
window.addEventListener('click', onClick);



    function animate() {
        renderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(animate);
    }

    canvas.appendChild(renderer.domElement);

    const meshfloor = new Mesh(
        new PlaneGeometry(130, 130, 10, 10),
        new MeshPhongMaterial({
            color: 0xBCF4FA,
            wireframe: false
        })
    )
    meshfloor.rotation.x -= Math.PI / 2;
    meshfloor.receiveShadow = true;
    // scene.add(meshfloor);
    light.position.set(4, 20, 4);


    animate();
}
//var scenes = [], sol_camera, emptyScene;
//sol_animate();
//function initsol(sol_canvas) {
//  var sol_canvas = document.getElementById( "c" );
//
//  let sol_camera = new PerspectiveCamera( 75, 1, 0.1, 100 );
//  sol_camera.position.z = 1.5;
//
//  var geometries = [
//    new BoxGeometry( 1, 1, 1 ),
//    new SphereGeometry( 0.5, 12, 12 ),
//    new DodecahedronGeometry( 0.5 ),
//    new CylinderGeometry( 0.5, 0.5, 1, 12 ),
//  ];
//
//  var template = document.getElementById("template").text;
//  var content = document.getElementById("content");
//
//  var emptyScene = new Scene();
//
//
//  var numScenes = 100;
//
//  for ( var ii =  0; ii < numScenes; ++ii ) {
//
//    var scene = new Scene();
//
//    // make a list item.
//    var element = document.createElement( "div" );
//    element.innerHTML = template;
//    element.className = "list-item";
//
//    // Look up the element that represents the area
//    // we want to render the scene
//    scene.element = element.querySelector(".scene");
//    content.appendChild(element);
//
//    // add one random mesh to each scene
//    var geometry = geometries[ geometries.length * Math.random() | 0 ];
//    var material = new MeshLambertMaterial( { color: randColor() } );
//
//    scene.add( new Mesh( geometry, material ) );
//
//    let light = new DirectionalLight( 0xffffff );
//    light.position.set( 0.5, 0.8, 1 );
//    scene.add( light );
//
//    light = new DirectionalLight( 0xffffff );
//    light.position.set( -0.5, -0.8, -1 );
//    scene.add( light );
//
//    scenes.push( scene );
//  }
//
//}
//
//function updateSize() {
//  var sol_canvas = document.getElementById( "c" );
//
//  var width = sol_canvas.clientWidth;
//  var height = sol_canvas.clientHeight;
//
//  if ( sol_canvas.width !== width || sol_canvas.height != height ) {
//
//    sol_renderer.setSize ( width, height, false );
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
//  var sol_canvas = document.getElementById( "c" );
//
//  updateSize();
//
//  sol_canvas.style.transform = `translateY(${window.scrollY}px`;
//
//  sol_renderer.setClearColor( 0xFFFFFF );
//  sol_renderer.clear( true );
//  sol_renderer.setClearColor( 0xE0E0E0 );
//
//  sol_renderer.setScissorTest( true );
//  scenes.forEach( function( scene ) {
//    // so something moves
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
//    if ( rect.bottom < 0 || rect.top  > sol_renderer.domElement.clientHeight ||
//       rect.right  < 0 || rect.left > sol_renderer.domElement.clientWidth ) {
//      return;  // it's off screen
//    }
//
//    // set the viewport
//    var width  = rect.right - rect.left;
//    var height = rect.bottom - rect.top;
//    var left   = rect.left;
//    var top    = rect.top;
//
//    sol_renderer.setViewport( left, top, width, height );
//    sol_renderer.setScissor( left, top, width, height );
//
//    sol_camera.aspect = width / height;
//    sol_camera.updateProjectionMatrix();
//
//    sol_renderer.render( scene, sol_camera );
//
//  } );
//  sol_renderer.setScissorTest( false );
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
//NEW APPROACH START
let sol_scene;
let mesh;
const AMOUNT = 6;

solinit();
solanimate();

function solinit() {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;

    const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;



    const cameras = [];

    for ( let y = 0; y < AMOUNT; y ++ ) {

        for ( let x = 0; x < AMOUNT; x ++ ) {

            const subcamera = new PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
            subcamera.viewport = new Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
            subcamera.position.x = ( x / AMOUNT ) - 0.5;
            subcamera.position.y = 0.5 - ( y / AMOUNT );
            subcamera.position.z = 1.5;
            subcamera.position.multiplyScalar( 2 );
            subcamera.lookAt( 0, 0, 0 );
            subcamera.updateMatrixWorld();
            cameras.push( subcamera );

        }

    }

    let camera = new ArrayCamera( cameras );
    camera.position.z = 3;

    sol_scene = new Scene();

    sol_scene.add( new AmbientLight( 0x999999 ) );

    const light = new DirectionalLight( 0xffffff, 3 );
    light.position.set( 0.5, 0.5, 1 );
    light.castShadow = true;
    light.shadow.camera.zoom = 4; // tighter shadow map
    sol_scene.add( light );

    const geometryBackground = new PlaneGeometry( 100, 100 );
    const materialBackground = new MeshPhongMaterial( { color: 0x000066 } );

    const background = new Mesh( geometryBackground, materialBackground );
    background.receiveShadow = true;
    background.position.set( 0, 0, - 1 );
    sol_scene.add( background );

    const geometryCylinder = new CylinderGeometry( 0.5, 0.5, 1, 32 );
    const materialCylinder = new MeshPhongMaterial( { color: 0xff0000 } );

    mesh = new Mesh( geometryCylinder, materialCylinder );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sol_scene.add( mesh );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    const ASPECT_RATIO = window.innerWidth / window.innerHeight;
    const WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;

    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();

    for ( let y = 0; y < AMOUNT; y ++ ) {

        for ( let x = 0; x < AMOUNT; x ++ ) {

            const subcamera = camera.cameras[ AMOUNT * y + x ];

            subcamera.viewport.set(
                Math.floor( x * WIDTH ),
                Math.floor( y * HEIGHT ),
                Math.ceil( WIDTH ),
                Math.ceil( HEIGHT ) );

            subcamera.aspect = ASPECT_RATIO;
            subcamera.updateProjectionMatrix();

        }

    }

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function solanimate() {

    mesh.rotation.x += 0.005;
    mesh.rotation.z += 0.01;

    renderer.render( sol_scene, camera );

    requestAnimationFrame( solanimate );

}
//NEW APPROACH END




function createSphere(x, y, z, color, radius, segs) {
    let mat = new MeshPhongMaterial({
        color: color,
        specular: color,
        shininess: 30
    });
    mat.castShadow = true;
    mat.receiveShadow = true;
    let sphere = new Mesh(new SphereGeometry(radius, segs, segs), mat);
    sphere.position.set(x, z, y);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.name = ["s", x, y, z].join(",");
    return sphere;
}

function disposeSphere(instance) {
    scene.remove(instance);
    instance.material.dispose();
    instance.dispose();
}

export default class {
    createSphere(x, y, z, color, radius = 1, segs = 15) {
        return createSphere(x, y, z, color, radius, segs);
    }
    disposeSphere(sphere) {
        disposeSphere(sphere);
    }

    add(obj) {
        scene.add(obj);
    }

    init(dom) {
        console.log("Accessing panel");
        console.log(dom);
        initScene(dom);
    }
    init2(dom){
       console.log("Accessing sol");
       console.log(dom);
       solinit(dom);
    }


    dispose() {
        resizeObeserver.disconnect();
        cancelAnimationFrame();
    }
};
function resetFirstPlacementCoord() {
    firstPlacementCoord = null;
    console.log(firstPlacementCoord)
}
export {Colours }
