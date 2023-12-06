const STEP = Math.sqrt(2);

function calcPosition(layer, radius, x, y, maxLayer) {
    let z = (maxLayer - layer) * STEP + radius;
    let xx = radius + 2 * x * radius + radius * (maxLayer - layer);
    let yy = radius + 2 * y * radius + radius * (maxLayer - layer);
    return [xx, yy, z];
}

function PyramidLayer(size, radius, total) {
    this.size = size;
    this.matrix = [];

    for (let i = 0; i < size; i++) {
        this.matrix.push([]);
        for (let j = 0; j < size; j++) {
            this.matrix[i].push({
                color: 0x233333,
                pos: calcPosition(size, radius, i, j, total),
                userData: null,
            });
        }
    }

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

function Pyramid(layersNum, sphereRadius = 1) {
    this.n = layersNum;
    this.r = sphereRadius;
    this.layers = [];

    this.radius = function () {
        return this.r;
    };

    this.getLayer = function (layer) {
        return this.layers[this.n - layer];
    };

    this.get = function (layer, x, y) {
        return this.layers[layer].get(x, y);
    };

    this.init = function () {
        this.layers = [];
        for (let i = 0; i < this.n; i++) {
            this.layers.push(new PyramidLayer(this.n - i, this.r, this.n));
        }
    };

    this.init(); // Initialize the Pyramid object immediately.
}

// Export the Pyramid and PyramidLayer objects
export default Pyramid;
export { PyramidLayer }