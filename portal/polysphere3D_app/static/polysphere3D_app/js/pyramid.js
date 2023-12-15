/**
 * The step value used in calculations.
 * @type {number}
 */
const STEP = Math.sqrt(2);

/**
 * Calculates the position of a point in 3D space based on the given parameters.
 * @param {number} layer - The layer of the point.
 * @param {number} radius - The radius of the sphere.
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {number} maxLayer - The maximum layer of the sphere.
 * @returns {number[]} The calculated position as an array [x, y, z].
 */
function calculatePosition(layer, radius, x, y, maxLayer) {
    let z = (maxLayer - layer) * STEP + radius;
    let xx = radius + 2 * x * radius + radius * (maxLayer - layer);
    let yy = radius + 2 * y * radius + radius * (maxLayer - layer);
    return [xx, yy, z];
}

/**
 * Represents a layer of a pyramid in 3D space.
 * @constructor
 * @param {number} size - The size of the layer.
 * @param {number} radius - The radius of the pyramid.
 * @param {number} total - The total number of layers in the pyramid.
 */
function PyramidLayer(size, radius, total) {
    this.size = size;
    this.matrix = [];

    for (let i = 0; i < size; i++) {
        this.matrix.push([]);
        for (let j = 0; j < size; j++) {
            this.matrix[i].push({
                color: 0x999999,
                pos: calculatePosition(size, radius, i, j, total),
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

/**
 * Represents a Pyramid object.
 * @constructor
 * @param {number} layersNum - The number of layers in the pyramid.
 * @param {number} [sphereRadius=1] - The radius of the sphere.
 */
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