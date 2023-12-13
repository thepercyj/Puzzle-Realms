function PyramidLayer(size, matrix) {
    this.size = size;
    this.matrix = matrix || [];

    this.fill = function (matrix) {
        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                this.matrix[i][j].color = matrix[i][j];
    };f

    this.set = function (x, y, color) {
        this.matrix[x][y].color = color;
    };

    this.get = function (x, y) {
        return this.matrix[x][y];
    };
}

function Pyramid(layersNum, sphereRadius = 1) {
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
}

// Export the Pyramid, PyramidLayer, and Sphere objects
const Sphere = {};

export default Pyramid;
export { PyramidLayer, Sphere };