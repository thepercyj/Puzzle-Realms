import { OrbitControl } from "./OrbitControl.js";
import {
    Scene, Vector4, MeshBasicMaterial, ShapeGeometry, ArrayCamera, MeshLambertMaterial, DirectionalLight, PerspectiveCamera, AmbientLight, PointLightHelper, WebGLRenderer, PointLight, BoxGeometry, DodecahedronGeometry, CylinderGeometry,
    SphereGeometry, MeshPhongMaterial, Mesh, PlaneGeometry, Color, PCFSoftShadowMap, Raycaster, Vector2, Vector3, RectAreaLight, AxesHelper
} from "./three.js";

/**
 * Represents the sol_scene object.
 * @type {Scene}
 */
const sol_scene = new Scene();
/**
 * Represents a camera in the 3D scene.
 * @type {PerspectiveCamera}
 */
const camera = new PerspectiveCamera();
sol_scene.background = new Color("rgb(188,244,250)");
const globalLight = new AmbientLight(0xeeeeee);
sol_scene.add(globalLight);

const light = new PointLight(0xBCF4FA, 15, 0);
light.castShadow = true;
const helper = new PointLightHelper(light, 2);
sol_scene.add(light);
sol_scene.add(helper);
light.intensity = 0.5;
light.position.set(0, 0, 1).normalize();

const renderer = new WebGLRenderer({ antialias: true });

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(0x999999);

let resizeObeserver;
let firstPlacementCoord = null;
let currentShapePlacements = [];

/**
 * Represents the input shapes for the sol scene.
 * @typedef {Object} sol_inputShapes
 * @property {Function} get - Retrieves the input shapes.
 * @property {Function} add - Adds a shape to the input shapes.
 * @property {Function} clear - Clears the input shapes.
 * @property {Array} store - The array that stores the input shapes.
 */
export let sol_inputShapes = {
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

export let sol_inputCoords = {
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
 * Object representing the colours used in the sol scene.
 * @typedef {Object} sol_Colours
 * @property {number} A - Colour A represented as hexadecimal value.
 * @property {number} B - Colour B represented as hexadecimal value.
 * @property {number} C - Colour C represented as hexadecimal value.
 * @property {number} D - Colour D represented as hexadecimal value.
 * @property {number} E - Colour E represented as hexadecimal value.
 * @property {number} F - Colour F represented as hexadecimal value.
 * @property {number} G - Colour G represented as hexadecimal value.
 * @property {number} H - Colour H represented as hexadecimal value.
 * @property {number} I - Colour I represented as hexadecimal value.
 * @property {number} J - Colour J represented as hexadecimal value.
 * @property {number} K - Colour K represented as hexadecimal value.
 * @property {number} L - Colour L represented as hexadecimal value.
 */
const sol_Colours = {
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
 * Initializes the scene with the given canvas element.
 * 
 * @param {HTMLCanvasElement} sol_canvas - The canvas element to render the scene on.
 */
export function initScene(sol_canvas) {
    camera.fov = 75;
    camera.near = 0.2;
    camera.far = 300;
    camera.position.z = 18;
    camera.position.x = -0;
    camera.position.y = 0;

    renderer.setSize(sol_canvas.clientWidth, sol_canvas.clientWidth);
    resizeObeserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            camera.aspect = sol_canvas.clientWidth / sol_canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(sol_canvas.clientWidth, sol_canvas.clientWidth);
        })
    });
    resizeObeserver.observe(sol_canvas);

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

    function setInput(shape, coord) {
        if (!(sol_inputShapes.get().includes(shape))) {
            sol_inputShapes.add(shape);
            sol_inputCoords.add(new Array(coord));
        } else {
            sol_inputCoords.get()[sol_inputShapes.get().indexOf(shape)].push(coord);
        }
    }

    const raycaster = new Raycaster();
    const pointer = new Vector2();
    function animate() {
        renderer.render(sol_scene, camera);
        controls.update();
        requestAnimationFrame(animate);
    }

    sol_canvas.appendChild(renderer.domElement);

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
 * Creates a sphere with the specified position, color, radius, and number of segments.
 * @param {number} x - The x-coordinate of the sphere's position.
 * @param {number} y - The y-coordinate of the sphere's position.
 * @param {number} z - The z-coordinate of the sphere's position.
 * @param {string} color - The color of the sphere.
 * @param {number} radius - The radius of the sphere.
 * @param {number} segs - The number of segments used to create the sphere.
 * @returns {Mesh} The created sphere mesh.
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

function disposeSphere(instance) {
    sol_scene.remove(instance);
    instance.material.dispose();
    instance.dispose();
}

/**
 * Represents a SolScene object.
 * @class
 */
export default class {
    /**
     * Creates a sphere object.
     * @param {number} x - The x-coordinate of the sphere.
     * @param {number} y - The y-coordinate of the sphere.
     * @param {number} z - The z-coordinate of the sphere.
     * @param {string} color - The color of the sphere.
     * @param {number} [radius=1] - The radius of the sphere.
     * @param {number} [segs=15] - The number of segments of the sphere.
     * @returns {object} The created sphere object.
     */
    createSphere(x, y, z, color, radius = 1, segs = 15) {
        return createSphere(x, y, z, color, radius, segs);
    }

    /**
     * Disposes a sphere object.
     * @param {object} sphere - The sphere object to dispose.
     */
    disposeSphere(sphere) {
        disposeSphere(sphere);
    }

    /**
     * Adds an object to the SolScene.
     * @param {object} obj - The object to add.
     */
    add(obj) {
        sol_scene.add(obj);
    }

    /**
     * Initializes the SolScene.
     * @param {object} dom - The DOM element to attach the scene to.
     */
    sol_init(dom) {
        initScene(dom);
    }

    /**
     * Disposes the SolScene.
     */
    dispose() {
        resizeObeserver.disconnect();
        cancelAnimationFrame();
    }
};

function resetFirstPlacementCoord() {
    firstPlacementCoord = null;
}

export { sol_Colours };
