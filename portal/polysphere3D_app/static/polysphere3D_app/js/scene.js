import { OrbitControl } from "./OrbitControl.js";
import {
    Scene, Vector4, MeshBasicMaterial, ShapeGeometry, ArrayCamera, MeshLambertMaterial, DirectionalLight, PerspectiveCamera, AmbientLight, PointLightHelper, WebGLRenderer, PointLight, BoxGeometry, DodecahedronGeometry, CylinderGeometry,
    SphereGeometry, MeshPhongMaterial, Mesh, PlaneGeometry, Color, PCFSoftShadowMap, Raycaster, Vector2, Vector3, RectAreaLight, AxesHelper
} from "./three.js";
import { shapeStore } from "./Shapes3D.js";

/**
 * Represents a scene in the application.
 * @class
 */
const scene = new Scene();
/**
 * Represents the camera used in the scene.
 * @type {PerspectiveCamera}
 */
const camera = new PerspectiveCamera();
scene.background = new Color("rgb(188,244,250)");
/**
 * Represents the global light in the scene.
 * @type {AmbientLight}
 */
const globalLight = new AmbientLight(0xeeeeee);
scene.add(globalLight);

/**
 * Represents a light source in the scene.
 * @type {PointLight}
 */
const light = new PointLight(0xBCF4FA, 15, 0);
light.castShadow = true;
/**
 * Represents a helper for a point light.
 * @type {PointLightHelper}
 */
const helper = new PointLightHelper(light, 2);
scene.add(light);
scene.add(helper);
light.intensity = 0.5;
light.position.set(0, 0, 1).normalize();

/**
 * The WebGL renderer used for rendering the scene.
 * @type {WebGLRenderer}
 */
const renderer = new WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(0x999999);

let resizeObeserver;
let firstPlacementCoord = null;
let currentShapePlacements = [];

/**
 * Represents a collection of input shapes.
 * @typedef {Object} inputShapes
 * @property {Function} get - Retrieves the input shapes.
 * @property {Function} add - Adds a shape to the collection.
 * @property {Function} clear - Clears the collection of input shapes.
 * @property {Array} store - The array that stores the input shapes.
 */
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
    store: []
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
    store: []
};

/**
 * Object representing the colours used in the scene.
 * @typedef {Object} Colours
 * @property {number} A - The hexadecimal value of colour A.
 * @property {number} B - The hexadecimal value of colour B.
 * @property {number} C - The hexadecimal value of colour C.
 * @property {number} D - The hexadecimal value of colour D.
 * @property {number} E - The hexadecimal value of colour E.
 * @property {number} F - The hexadecimal value of colour F.
 * @property {number} G - The hexadecimal value of colour G.
 * @property {number} H - The hexadecimal value of colour H.
 * @property {number} I - The hexadecimal value of colour I.
 * @property {number} J - The hexadecimal value of colour J.
 * @property {number} K - The hexadecimal value of colour K.
 * @property {number} L - The hexadecimal value of colour L.
 */
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

/**
 * Initializes the scene with the given canvas.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to render the scene on.
 */
export function initialiseScene(canvas) {
    camera.fov = 75;
    camera.near = 0.2;
    camera.far = 300;
    camera.position.z = 18;
    camera.position.x = -0;
    camera.position.y = 0;

    renderer.setSize(canvas.clientWidth, canvas.clientWidth);
    resizeObeserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientWidth);
        })
    });
    resizeObeserver.observe(canvas);

    const controls = new OrbitControl(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
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
        } else {
            x_index = (x - 1 - 1 * layer) / 2;
            y_index = (y - 1 - 1 * layer) / 2;
        }
        return [x_index, y_index, layer];
    }

    /**
     * Sets the input shape and coordinate.
     * If the shape is not already in the inputShapes set, it adds the shape and creates a new array with the given coordinate.
     * If the shape is already in the inputShapes set, it appends the coordinate to the existing array.
     * 
     * @param {string} shape - The shape to set as input.
     * @param {number} coord - The coordinate to set for the shape.
     */
    function setInput(shape, coord) {
        if (!(inputShapes.get().includes(shape))) {
            inputShapes.add(shape);
            inputCoords.add(new Array(coord));
        } else {
            inputCoords.get()[inputShapes.get().indexOf(shape)].push(coord);
        }
    }

    const raycaster = new Raycaster();
    const pointer = new Vector2();

    /**
     * Handles the click event on the canvas.
     * @param {MouseEvent} event - The click event object.
     */
    function onClick(event) {
        const canvasBounds = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - canvasBounds.left) / canvas.clientWidth) * 2 - 1;
        pointer.y = -((event.clientY - canvasBounds.top) / canvas.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        let currentShapeElement = document.getElementById("currentImage");
        let shape = currentShapeElement.className;
        let currentShape = shapeStore[shape]

        const intersects = raycaster.intersectObjects(scene.children);

        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.visible === true) {
                // Get only visibile objects
                if (intersects[i].object.name[0] === "s") {
                    // Get only sphere's
                    if (intersects[i].object.material.color.equals(new Color(0x999999))) {
                        // Get only empty spheres (colour = black)
                        intersects[i].object.material.color.set(Colours[shape]);
                        let coord = arrayCoordsFromWorldCoords(intersects[i].object.position.x, intersects[i].object.position.z, intersects[i].object.position.y);
                        setInput(shape, coord);
                        console.log(inputShapes.get());
                        console.log(inputCoords.get());
                        break;
                    }
                }
            }
        }
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

    light.position.set(4, 20, 4);

    animate();
}

/**
 * Creates a sphere object with the specified position, color, radius, and number of segments.
 * @param {number} x - The x-coordinate of the sphere's position.
 * @param {number} y - The y-coordinate of the sphere's position.
 * @param {number} z - The z-coordinate of the sphere's position.
 * @param {string} color - The color of the sphere.
 * @param {number} radius - The radius of the sphere.
 * @param {number} segs - The number of segments used to create the sphere.
 * @returns {Mesh} The created sphere object.
 */
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

/**
 * Removes a sphere instance from the scene and disposes its material and geometry.
 * @param {Object3D} instance - The sphere instance to dispose.
 */
function disposeSphere(instance) {
    scene.remove(instance);
    instance.material.dispose();
    instance.dispose();
}

/**
 * Represents a Scene object.
 * @class
 */
export default class {
    /**
     * Creates a sphere and adds it to the scene.
     * @param {number} x - The x-coordinate of the sphere.
     * @param {number} y - The y-coordinate of the sphere.
     * @param {number} z - The z-coordinate of the sphere.
     * @param {string} color - The color of the sphere.
     * @param {number} [radius=1] - The radius of the sphere.
     * @param {number} [segs=15] - The number of segments of the sphere.
     * @returns {Object} The created sphere object.
     */
    createSphere(x, y, z, color, radius = 1, segs = 15) {
        return createSphere(x, y, z, color, radius, segs);
    }

    /**
     * Disposes a sphere from the scene.
     * @param {Object} sphere - The sphere object to be disposed.
     */
    disposeSphere(sphere) {
        disposeSphere(sphere);
    }

    /**
     * Adds an object to the scene.
     * @param {Object} obj - The object to be added to the scene.
     */
    add(obj) {
        scene.add(obj);
    }

    /**
     * Initializes the scene with the provided DOM element.
     * @param {HTMLElement} dom - The DOM element to initialize the scene with.
     */
    init(dom) {
        initialiseScene(dom);
    }

    /**
     * Disposes the scene and cleans up resources.
     */
    dispose() {
        resizeObeserver.disconnect();
        cancelAnimationFrame();
    }
};

export { Colours };
