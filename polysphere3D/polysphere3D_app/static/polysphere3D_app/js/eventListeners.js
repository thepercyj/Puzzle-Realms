function handleKeyUp(event) {
    event.target.value = event.target.value.replace(/[^A-La-l]/g, '').toUpperCase();
    console.log(event.target.value);
    }

// Makes layers visible
function layerVisible(idx, v) {
    console.log("layerVisible " + idx + v);
    let layer = worker.getLayer(idx); // Make sure 'worker' is accessible here
    const spheres = layer.matrix;
    for (let x = 0; x < layer.size; x++) {
        for (let y = 0; y < layer.size; y++) {
            if (spheres[x][y].userData) {
                spheres[x][y].userData.visible = v;
                spheres[x][y].visible = v;
                spheres[x][y].userData.needsUpdate = true;
                console.log("?");
            }
        }
    }
}



