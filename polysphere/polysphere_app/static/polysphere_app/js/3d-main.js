import { OrbitControls } from "../js/OrbitControls.js";
import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight,
  AxesHelper,
  GridHelper,
  Light
} from "../js/three-module.js";

let placingPiece = null;

const btnSolve = document.getElementById("btnSolve");
btnSolve.addEventListener('click', ()=> attemptSolve());

const btnReset = document.getElementById("btnReset");
btnReset.addEventListener('click', ()=> reset());

const ddlX = document.getElementById("ddlX");
ddlX.addEventListener('change', () => filterChanged());
const ddlY = document.getElementById("ddlY");
ddlY.addEventListener('change', () => filterChanged());
const ddlZ = document.getElementById("ddlZ");
ddlZ.addEventListener('change', () => filterChanged());

class Location{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Atom{
    constructor(x, y, z){
        this.offset = new Location(x, y, z);
    }
}

class Piece{
    constructor(rootPosition, rotation, plane, nodes, name, character){
        this.rootPosition = rootPosition;
        this.rotation = rotation;
        this.plane = plane;
        this.nodes = nodes;
        this.name = name;
        this.character = character;
    }
    mirrorX;
    lean;
    absolutePosition;

    #applyLean(offset){
        if(this.lean === true){
            return new Location(offset.x, 0, offset.y);
        } else{
            return offset;
        }
    }

    #applyMirrorX(offset){
        return new Location(offset.x + offset.y, -offset.y, offset.z);
    }
//Need to add new plane here ?
    #transposeToPlane(origin){
        if(this.plane === 0){
            return origin;
        }else if(this.plane === 1){
            return new Location(5-(origin.x + origin.y + origin.z), origin.x, origin.z); //For plane 1, origin.x changes, y is same as x and z remains same
        }else if(this.plane === 2){
            return new Location(origin.y, 5 - (origin.x + origin.y + origin.z), origin.z); //For plane 2, origin.x is same as y, origin.y changes & origin z remains same
        }
        throw new Error('Plane must be between 0 and 2');
    }

    #rotate(location){
        if(this.rotation == 0){
            return location;
        }

        if(this.rotation > 5){
            throw new Error('Invalid rotation');
        }

        let toRet = new Location(location.x, location.y, location.z);

        for (let i = 0; i < this.rotation; i++) {
            toRet = new Location(-toRet.y, toRet.x + toRet.y, toRet.z);
        }

        return toRet;
    }

    getAbsolutePosition(){
        var toRet = [];

        for (let i = 0; i < this.nodes.length; i++) {
            let start = (this.mirrorX ? this.#applyMirrorX(this.nodes[i].offset) : this.nodes[i].offset);
            let offset = this.#rotate(start);
            let lean = this.#applyLean(offset);
            let origin = new Location(this.rootPosition.x + lean.x,
                this.rootPosition.y + lean.y,
                this.rootPosition.z + lean.z);
            var transpose = this.#transposeToPlane(origin);
            toRet.push(new Atom(transpose.x, transpose.y, transpose.z));
        }

        return toRet;
    }

    isOutOfBounds(){
        const abs = this.absolutePosition;

        if(abs.some((m) => m.offset.z < 0)){
            return true;
        }
        if(abs.some((m) => m.offset.x < 0)){
            return true;
        }
        if(abs.some((m) => m.offset.y < 0)){
            return true;
        }
        if(abs.some((m) => m.offset.x + m.offset.y + m.offset.z > 5)){
            return true;
        }

        return false;
    }

    isInSamePositionAs(piece){
        if(piece.nodes.length != this.nodes.length){
            return false;
        }

        const t = this.absolutePosition;
        const p = piece.absolutePosition;

        for (let i = 0; i < t.length; i++) {
            let nodeMatch = false;
            for (let j = 0; j < p.length; j++) {
                if(t[i].offset.x === p[j].offset.x && t[i].offset.y === p[j].offset.y && t[i].offset.z === p[j].offset.z){
                    nodeMatch = true;
                    break;
                }
            }
            if(!nodeMatch){
                return false;
            }
        }

        return true;
    }

    usesLocation(x, y, z){
        let toRet = false;
        for (let i = 0; i < this.absolutePosition.length; i++) {
            const node = this.absolutePosition[i];
            if((x == null ? true : node.offset.x == x) &&
                (y == null ? true : node.offset.y == y) &&
                (z == null ? true : node.offset.z == z)){
                toRet = true;
                break;
            }
        }
        return toRet;
    }
}

class PieceRegistry{
    colors = new Map();

    constructor(){
        this.#loadPossiblePositions()
    }

    #loadPossiblePositions(){
        for(let [key, value] of pieceHelper){
            this.colors.set(key, {
                allPositions: this.#loadPositionsForColor(value.ctor),
                validPositions: this.#loadPositionsForColor(value.ctor),
                vposIndex : 0
            })
        }
    }

    #loadPositionsForColor(constr){
        const toRet = [];

        for (let z = 0; z < 6; z++) // for each root position
        {
            for (let y = 0; y < 6; y++) // for each root position
            {
                for (let x = 0; x < 6; x++) // for each root position
                {
                    if (x + y + z > 5) // will be out of bounds
                        continue;

                    for (let r = 0; r < 6; r++) // for each rotated position
                    {
                        for (let p = 0; p < 3; p++) // for each plane Changed plane loop to 4
                        {
                            let piece = constr();
                            piece.rootPosition = new Location(x,y,z);
                            piece.plane = p;
                            piece.rotation = r;
                            piece.lean = false;
                            piece.mirrorX = false;
                            piece.absolutePosition = piece.getAbsolutePosition();

                            if (piece.isOutOfBounds() === false)
                            {
                                if (toRet.some(m => m.isInSamePositionAs(piece)) === false)
                                {
                                    toRet.push(piece);
                                }
                            }

                            piece = constr();
                            piece.rootPosition = new Location(x,y,z);
                            piece.plane = p;
                            piece.rotation = r;
                            piece.lean = true;
                            piece.mirrorX = false;
                            piece.absolutePosition = piece.getAbsolutePosition();

                            if (piece.isOutOfBounds() === false)
                            {
                                if (toRet.some(m => m.isInSamePositionAs(piece)) === false)
                                {
                                    toRet.push(piece);
                                }
                            }


                            // flip x
                            piece = constr();
                            piece.rootPosition = new Location(x,y,z);
                            piece.plane = p;
                            piece.rotation = r;
                            piece.lean = false;
                            piece.mirrorX = true;
                            piece.absolutePosition = piece.getAbsolutePosition();

                            if (piece.isOutOfBounds() === false)
                            {
                                if (toRet.some(m => m.isInSamePositionAs(piece)) === false)
                                {
                                    toRet.push(piece);
                                }
                            }

                            piece = constr();
                            piece.rootPosition = new Location(x,y,z);
                            piece.plane = p;
                            piece.rotation = r;
                            piece.lean = true;
                            piece.mirrorX = true;
                            piece.absolutePosition = piece.getAbsolutePosition();

                            if (piece.isOutOfBounds() === false)
                            {
                                if (toRet.some(m => m.isInSamePositionAs(piece)) === false)
                                {
                                    toRet.push(piece);
                                }
                            }
                        }
                    }
                }
            }
        }

        return toRet;
    }

    reset(){
        const values = this.colors.values();
        for(let value of values){
            value.validPositions = value.allPositions;
            value.vposIndex = 0;
        }
    }
}

class Board{
    boardMap = new Map();
    usedLocations = new Map();
    piecesUsed = new Map();
    pieceRegistry = new PieceRegistry();

    constructor(){
        this.#initializeBoard();
    }
//Here we can define the height of the pyramid
    #initializeBoard(){
        this.boardMap = new Map();

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                for (let k = 0; k < 6; k++) {

                    if (i + j + k < 6){
                        this.boardMap.set(`${i}${j}${k}`, { x: i, y: j, z: k, value : '-' })

                    } else{
                        this.boardMap.set(`${i}${j}${k}`, { x: i, y: j, z: k, value : ' ' })
                    }
                }
            }
        }

        this.piecesUsed = new Map();
        this.usedLocations = new Map();
    }

    getUnusedColors(){
        const toRet = new Map(
            [...this.pieceRegistry.colors]
            .filter(([k, v]) => !this.piecesUsed.has(k))
          );
        return toRet;
    }

    placePiece(piece){
        try {
            const abs = piece.absolutePosition;
            console.log("Placing Piece", abs)
            for (let i = 0; i < abs.length; i++) {
                const loc = abs[i].offset;
                const mapNode = this.boardMap.get(`${loc.x}${loc.y}${loc.z}`);
                if(mapNode.value != '-'){
                    throw new Error("Attempt to add piece in used location");
                }
                mapNode.value = piece.character;
                this.usedLocations.set(`${loc.x}${loc.y}${loc.z}`, loc);
            }
            this.piecesUsed.set(piece.character, piece);
        } catch (error) {
            this.removePiece(piece);
            throw new Error('Error placing piece');
        }
    }

    removePiece(piece){
        const abs = piece.absolutePosition;
        for (let i = 0; i < abs.length; i++) {
            const loc = abs[i].offset;
            const mapNode = this.boardMap.get(`${loc.x}${loc.y}${loc.z}`);
            mapNode.value = '-';
            this.usedLocations.delete(`${loc.x}${loc.y}${loc.z}`);
        }
        this.piecesUsed.delete(piece.character);
    }

    collision(piece){
        const abs = piece.absolutePosition;
        let toRet = false;

        for (let i = 0; i < abs.length; i++) {
            const loc = abs[i].offset;
            const mapNode = this.boardMap.get(`${loc.x}${loc.y}${loc.z}`);
            if(mapNode.value != '-'){
                toRet = true;
                break;
            }
        }

        return toRet;
    }

    resetBoard(){
        this.#initializeBoard();
        this.pieceRegistry.reset();
    }

    updateAllValidPositions(){
        for(let [key, value] of this.pieceRegistry.colors){
            if(this.piecesUsed.has(key)){
                continue; // only updating valid positions indexes of pieces that have not been used
            }
            else{
                value.validPositions = [];
                for (let i = 0; i < value.allPositions.length; i++) {
                    const piece = value.allPositions[i];
                    if(!this.collision(piece)){
                        value.validPositions.push(piece);
                    }
                }
            }
        }
    }

    solve(){
        const unusedColors = this.getUnusedColors();
        if(unusedColors.size == 0){
            return true;
        }
        const pieces = unusedColors.values().next().value.validPositions;

        if(pieces.length == 0){
            return false;
            return false;
        }

        for (let i = 0; i < pieces.length; i++) {
            const pos = pieces[i];
            if(!this.collision(pos)){ //this function checks for collisions
                this.placePiece(pos); //If there is no collision, the Piece is placed on board
                const s = this.solve();
                if(s == true){
                    return true;
                }
                this.removePiece(pos);
            }
        }

        return false;
    }
}

const pieceHelper = new Map();
pieceHelper.set('A', { ctor : () => { return new Lime();}} ); //Done
pieceHelper.set('B', { ctor : () => { return new Yellow();}} ); //Done
pieceHelper.set('C', { ctor : () => { return new DarkBlue();}} ); //Done
pieceHelper.set('D', { ctor : () => { return new LightGreen();}} ); //Done
pieceHelper.set('E', { ctor : () => { return new Red();}} ); //Done
pieceHelper.set('F', { ctor : () => { return new Pink();}} ); //Done
pieceHelper.set('G', { ctor : () => { return new Green();}} ); //Done
pieceHelper.set('H', { ctor : () => { return new LightPurple();}} ); //Done
pieceHelper.set('I', { ctor : () => { return new Orange();}} ); //Done
pieceHelper.set('J', { ctor : () => { return new Peach();}} ); //Done
pieceHelper.set('K', { ctor : () => { return new Gray();}} ); //Done
pieceHelper.set('L', { ctor : () => { return new Purple();}} ); //Done

class DarkBlue extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'DarkBlue', 'C');
    }
}

class Gray extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(2,1,0),
            new Atom(2,2,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Gray', 'K');
    }
}

class Red extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(0,1,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Red', 'E');
    }
}

class Green extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(3,0,0),
            new Atom(0,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Green', 'G');
    }
}

class LightGreen extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(0,1,0),
            new Atom(0,2,0),
            new Atom(1,0,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'LightGreen', 'D');
    }
}

class Lime extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(3,0,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Lime', 'A');
    }
}

class Orange extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(0,1,0),
            new Atom(0,2,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Orange', 'I');
    }
}

class Peach extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(1,2,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Peach', 'J');
    }
}

class Pink extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(2,1,0),
            new Atom(3,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Pink', 'F');
    }
}

class Purple extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Purple', 'L');
    }
}

class LightPurple extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(1,1,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'LightPurple', 'H');
    }
}

class Yellow extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(0,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Yellow', 'B');
    }
}

const board = new Board();


// add control panel
for(let [key, value] of board.pieceRegistry.colors){
    const controlPanel = document.getElementById("controlPanel");

    const colorContainer = document.createElement('div');
    colorContainer.id = 'colorContainer' + key;
    colorContainer.className = 'color-container';

    const lbl = document.createElement('label');
    lbl.classList.add('color-label');
    lbl.id= 'lbl' + key;

    if(board.piecesUsed.has(key)){
        lbl.innerText = key;
    } else{
        lbl.innerText = key + '(' + board.pieceRegistry.colors.get(key).validPositions.length  + ')';
    }

    colorContainer.appendChild(lbl);

    colorContainer.appendChild(createButton('Add', key, 'btn-primary', ()=> initiatePlacing(key)));
    colorContainer.appendChild(createButton('Prev', key, 'btn-primary', ()=> placePrevPosition(key)));
    colorContainer.appendChild(createButton('Cut', key, 'btn-danger', ()=> removePiece(key)));
    colorContainer.appendChild(createButton('Set', key, 'btn-success', ()=> setPiece(key)));
    colorContainer.appendChild(createButton('Next', key, 'btn-primary', ()=> placeNextPosition(key)));


    controlPanel.appendChild(colorContainer);
}

function createButton(name, key, className, clickHandler){
    const btnAdd = document.createElement('button');
    btnAdd.innerText = name;
    btnAdd.id = 'btn' + name + key;
    btnAdd.classList.add('btn');
    btnAdd.classList.add(className);
    btnAdd.classList.add('btn-sm');
    btnAdd.addEventListener('click', clickHandler);
    return btnAdd;
}

// Set up the scene
const scene = new Scene();
const renderer = new WebGLRenderer();
const mainPanel = document.querySelector('#main-panel');

// Set up the camera
const camera = new OrthographicCamera( window.innerWidth / - 16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / - 16, -500, 100 );
camera.position.set(1, 1, 1);
// Set up the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

mainPanel.appendChild(renderer.domElement);

// Set up the controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.enableZoom = true;
controls.enableRotate = true;

// Set up the spheres
const radius = 2;
const distancei = 4;
const distancej = 3.3;
const distancek = 3.3;

// Add ambient light to the scene
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 20, 0); // x, y, z
scene.add(dirLight);

// Create an AxesHelper
//scene.add(new GridHelper(80, 20));
scene.add(new AxesHelper(50));

function getMaterial(val){
    const s = 100;

    switch (val) {
        case 'A':
            return new MeshPhongMaterial({ color: 0xf2f783, shininess: s });
        case 'B':
            return new MeshPhongMaterial({ color: 0xedfa00, shininess: s });
        case 'C':
            return new MeshPhongMaterial({ color: 0x301adb, shininess: s });
        case 'D':
            return new MeshPhongMaterial({ color: 0x45f5a5, shininess: s });
        case 'E':
            return new MeshPhongMaterial({ color: 0xd60a18, shininess: s });
        case 'F':
            return new MeshPhongMaterial({ color: 0xd60a7a, shininess: s });
        case 'G':
            return new MeshPhongMaterial({ color: 0x074c06, shininess: s });
        case 'H':
            return new MeshPhongMaterial({ color: 0xa676f5, shininess: s });
        case 'I':
            return new MeshPhongMaterial({ color: 0xe25300, shininess: s });
        case 'J':
            return new MeshPhongMaterial({ color: 0xeda1b8, shininess: s });
        case 'K':
            return new MeshPhongMaterial({ color: 0x03fcfc, shininess: s });
        case 'L':
            return new MeshPhongMaterial({ color: 0x7c26ff, shininess: s });
        default:
            return new MeshPhongMaterial({ color: 0xDDDDDD });
    }
}

function drawBoard(){
    clearBoard();
    const values = board.boardMap.values();

    for(let value of values)
    {
        if(value.value != ' ' && value.value != '-'){
            const geometry = new SphereGeometry(radius, 32, 32);
            const material = getMaterial(value.value);
            const sphere = new Mesh(geometry, material);
            sphere.position.set(
                    value.y * distancej  + (value.z),
                    value.z * distancek,
                    value.x * distancei + (value.y + value.z) * 2
            );
            scene.add(sphere);
        }
    }
    updateControlPanel();
}

function updateControlPanel(){

    const btnSolve = document.getElementById('btnSolve');
    btnSolve.disabled = board.piecesUsed.size < 3;
    btnSolve.style.display = 'inline';

    const btnReset = document.getElementById('btnReset');
    btnReset.style.display = 'inline';

    const filters = document.getElementById('filters');
    filters.style.display = 'none';

    const lblNoSolution = document.getElementById('lblNoSolution');
    lblNoSolution.style.display = 'none';


    for(let [key, value] of board.pieceRegistry.colors){

        // reset some controls
        const colorContainer = document.getElementById('colorContainer' + key);
        colorContainer.classList.add('select-mode');
        colorContainer.classList.remove('place-mode');
        const btnAdd = document.getElementById('btnAdd' + key);
        btnAdd.disabled = false;


        // are we in placing mode?
        if(placingPiece != null){
            btnReset.style.display = 'none';
            btnSolve.style.display = 'none';
            filters.style.display = 'block';

            if(key !== placingPiece){
                // disable all controls for pieces we are not actively placing
                const colorContainer = document.getElementById('colorContainer' + key);
                colorContainer.classList.remove('select-mode');
                colorContainer.classList.add('place-mode');
            }
            else{
                // actively placing, hide add button
                btnAdd.style.display = 'none';
                // show next, prev, remove, set buttons
                showPlacingButtons(key);
            }
        }
        else{
            // in piece select mode
            ddlX.value = 'All';
            ddlY.value = 'All';
            ddlZ.value = 'All';

            if(board.piecesUsed.has(key)){
                btnAdd.style.display = 'none';
                const btnNext = document.getElementById('btnNext' + key);
                btnNext.style.display = 'none';
                const btnPrev = document.getElementById('btnPrev' + key);
                btnPrev.style.display = 'none';
                const btnCut = document.getElementById('btnCut' + key);
                btnCut.style.display = 'inline';
                const btnSet = document.getElementById('btnSet' + key);
                btnSet.style.display = 'none';
                const lbl = document.getElementById('lbl' + key);
                lbl.innerText = key + ' (---)';
            }else{
                btnAdd.style.display = 'inline';

                if(value.validPositions.length == 0){
                    btnAdd.disabled = true;
                }

                hidePlacingButtons(key);

                const lbl = document.getElementById('lbl' + key);
                lbl.innerText = key + '(' + board.pieceRegistry.colors.get(key).validPositions.length  + ')';
            }
        }
    }
}

function showPlacingButtons(key){
    const btnNext = document.getElementById('btnNext' + key);
    btnNext.style.display = 'inline';
    const btnPrev = document.getElementById('btnPrev' + key);
    btnPrev.style.display = 'inline';
    const btnCut = document.getElementById('btnCut' + key);
    btnCut.style.display = 'inline';
    const btnSet = document.getElementById('btnSet' + key);
    btnSet.style.display = 'inline';
}

function hidePlacingButtons(key){
    const btnNext = document.getElementById('btnNext' + key);
    btnNext.style.display = 'none';
    const btnPrev = document.getElementById('btnPrev' + key);
    btnPrev.style.display = 'none';
    const btnCut = document.getElementById('btnCut' + key);
    btnCut.style.display = 'none';
    const btnSet = document.getElementById('btnSet' + key);
    btnSet.style.display = 'none';
}

function clearBoard(){
    for( var i = scene.children.length - 1; i >= 0; i--) {
        let obj = scene.children[i];
        if(scene.children[i].type === 'Mesh'){
            scene.remove(obj);
        }
   }
}

// Render the scene
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update(); // Update the controls
}

function removePiece(char){
    const usedPiece = board.piecesUsed.get(char);
    const color = board.pieceRegistry.colors.get(char);

    if(usedPiece === undefined){
        throw new Error('That piece is not used');
    }
    board.removePiece(usedPiece);
    color.vposIndex = 0;
    placingPiece = null;
    board.updateAllValidPositions();
    drawBoard();
}

function setPiece(char){
    const color = board.pieceRegistry.colors.get(char);
    color.vposIndex = 0;
    placingPiece = null;
    board.updateAllValidPositions();
    drawBoard();
}

function initiatePlacing(i){

    const usedPiece = board.piecesUsed.get(i);
    const color = board.pieceRegistry.colors.get(i);

    if(usedPiece !== undefined){
        throw new Error('That piece is already used');
    }

    let positions = color.validPositions;

//    This part only runs when user has set X, Y & Z value from the UI
    if(ddlX.value != "All" || ddlY.value != "All" || ddlZ.value != "All"){
        const x = ddlX.value == "All" ? null : Number(ddlX.value);
        const y = ddlY.value == "All" ? null : Number(ddlY.value);
        const z = ddlZ.value == "All" ? null : Number(ddlZ.value);

        positions = positions.filter(m=> m.usesLocation(x, y, z));
    }

    if(positions.length == 0){
        return false;
    }

    const lbl = document.getElementById('lbl' + i);
    lbl.innerText = i + '(' + positions.length  + ')';

    color.vposIndex = 0;

    board.placePiece(positions[color.vposIndex]);
    updatePieceDetailsPanel(positions[color.vposIndex]);
    placingPiece = i;

    drawBoard();

    return true;
}

function placeNextPosition(i){
    const usedPiece = board.piecesUsed.get(i);
    const color = board.pieceRegistry.colors.get(i);

    if(usedPiece !== undefined){
        board.removePiece(usedPiece);
    }

    let positions = color.validPositions;

    if(ddlX.value != "All" || ddlY.value != "All" || ddlZ.value != "All"){
        const x = ddlX.value == "All" ? null : Number(ddlX.value);
        const y = ddlY.value == "All" ? null : Number(ddlY.value);
        const z = ddlZ.value == "All" ? null : Number(ddlZ.value);
        positions = positions.filter(m=> m.usesLocation(x, y, z));
    }

    color.vposIndex++;

    if(color.vposIndex >= positions.length){
        color.vposIndex = 0;
    }

    board.placePiece(positions[color.vposIndex]);
    updatePieceDetailsPanel(positions[color.vposIndex]);
    drawBoard();
}

function placePrevPosition(i){
    const usedPiece = board.piecesUsed.get(i);
    const color = board.pieceRegistry.colors.get(i);

    if(usedPiece !== undefined){
        board.removePiece(usedPiece);
    }

    let positions = color.validPositions;

    if(ddlX.value != "All" || ddlY.value != "All" || ddlZ.value != "All"){
        const x = ddlX.value == "All" ? null : Number(ddlX.value);
        const y = ddlY.value == "All" ? null : Number(ddlY.value);
        const z = ddlZ.value == "All" ? null : Number(ddlZ.value);
        positions = positions.filter(m=> m.usesLocation(x, y, z));
    }

    color.vposIndex--;

    if(color.vposIndex < 0){
        color.vposIndex = positions.length - 1;
    }
    board.placePiece(positions[color.vposIndex]);
    updatePieceDetailsPanel(positions[color.vposIndex]);
    drawBoard();
}

function updatePieceDetailsPanel(position){
    const lblPieceName = document.getElementById('lblPieceName');
    lblPieceName.innerText = "Name: " + position.name + '(' + position.character + ")";
    const lblRootPosition = document.getElementById('lblRootPosition');
    lblRootPosition.innerText = "Root: [" + position.rootPosition.x + ", " + position.rootPosition.y + ", " + position.rootPosition.z + "]";
    const lblRotation = document.getElementById('lblRotation');
    lblRotation.innerText = "Rotation: " + position.rotation;
    const lblLean = document.getElementById('lblLean');
    lblLean.innerText = "Lean: " + position.lean;
    const lblTranspose = document.getElementById('lblTranspose');
    lblTranspose.innerText = "Transpose Plane: " + position.plane;
    const lblMirror = document.getElementById('lblMirror');
    lblMirror.innerText = "Mirror X: " + position.mirrorX;
}

function filterChanged(){
    const i = placingPiece;
    const usedPiece = board.piecesUsed.get(placingPiece);
    const color = board.pieceRegistry.colors.get(placingPiece);
    // remove placingPiece
    if(usedPiece != undefined){
        board.removePiece(usedPiece);
    }
    color.vposIndex = 0;
    drawBoard();

    var positionsExist = initiatePlacing(i);

    if(!positionsExist){
        hidePlacingButtons(i);
    }else{
        showPlacingButtons(i);
    }
}

function attemptSolve(){
    const success = board.solve();
    if(success){
        console.log("Successfully solved");
        drawBoard();
    } else{
        const lbl = document.getElementById('lblNoSolution');
        lbl.style.display = 'inline';
    }
}

function reset(){
    board.resetBoard();
    drawBoard();
}

drawBoard();
render();