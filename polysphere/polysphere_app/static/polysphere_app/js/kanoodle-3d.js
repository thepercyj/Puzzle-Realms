export class Location{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class Atom{
    constructor(x, y, z){
        this.offset = new Location(x, y, z);
    }
}

export class Piece{
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

    #transposeToPlane(origin){
        if(this.plane === 0){
            return origin;
        }else if(this.plane === 1){
            return new Location(5-(origin.x + origin.y + origin.z), origin.x, origin.z);
        }else if(this.plane === 2){
            return new Location(origin.y, 5 - (origin.x + origin.y + origin.z), origin.z);
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

export class PieceRegistry{
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
                        for (let p = 0; p < 3; p++) // for each plane
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

export class Board{
    boardMap = new Map();
    usedLocations = new Map();
    piecesUsed = new Map();
    pieceRegistry = new PieceRegistry();

    constructor(){
        this.#initializeBoard();
    }

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
        }

        for (let i = 0; i < pieces.length; i++) {
            const pos = pieces[i];
            if(!this.collision(pos)){
                this.placePiece(pos);
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
pieceHelper.set('A', { ctor : () => { return new Lime();}} );
pieceHelper.set('B', { ctor : () => { return new Yellow();}} );
pieceHelper.set('C', { ctor : () => { return new DarkBlue();}} );
pieceHelper.set('D', { ctor : () => { return new LightBlue();}} );
pieceHelper.set('E', { ctor : () => { return new Red();}} );
pieceHelper.set('F', { ctor : () => { return new Pink();}} );
pieceHelper.set('G', { ctor : () => { return new Green();}} );
pieceHelper.set('H', { ctor : () => { return new White();}} );
pieceHelper.set('I', { ctor : () => { return new Orange();}} );
pieceHelper.set('J', { ctor : () => { return new Peach();}} );
pieceHelper.set('K', { ctor : () => { return new Gray();}} );
pieceHelper.set('L', { ctor : () => { return new Purple();}} );

export class DarkBlue extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'DarkBlue', 'C');
    }
}

export class Gray extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(0,1,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Gray', 'K');
    }
}

export class Red extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(0,1,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Red', 'E');
    }
}

export class Green extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(0,1,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Green', 'G');
    }
}

export class LightBlue extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(3,0,0),
            new Atom(0,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'LightBlue', 'D');
    }
}

export class Lime extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(1,2,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Lime', 'A');
    }
}

export class Orange extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(1,2,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Orange', 'I');
    }
}

export class Peach extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(1,1,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Peach', 'J');
    }
}

export class Pink extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(3,0,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Pink', 'F');
    }
}

export class Purple extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(1,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Purple', 'L');
    }
}

export class White extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(0,1,0),
            new Atom(0,2,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'White', 'H');
    }
}

export class Yellow extends Piece{
    constructor(){
        const nodes = [
            new Atom(0,0,0),
            new Atom(1,0,0),
            new Atom(2,0,0),
            new Atom(1,1,0),
            new Atom(2,1,0)];
        super(new Location(0,0,0), 0, 0, nodes, 'Yellow', 'B');
    }
}
