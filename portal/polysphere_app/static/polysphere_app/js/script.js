import * as THREE from 'https://unpkg.com/three@0.151.3/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.151.3/examples/jsm/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create spheres and arrange them in a pyramid shape
const baseSize = 5;
const pyramidHeight = 5;
const sphereRadius = 0.5;
const spheres = [];

for (let y = 0; y < pyramidHeight; y++) {
  for (let x = -y / 2; x <= y / 2; x++) {
    for (let z = -y / 2; z <= y / 2; z++) {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(sphereRadius),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      );
      sphere.position.set(x, y, z);
      spheres.push(sphere);
      scene.add(sphere);
    }
  }
}

// Adjust the position of the pyramid to center it
const xOffset = -baseSize / 2 + sphereRadius / 2;
const zOffset = -baseSize / 2 + sphereRadius / 2;
spheres.forEach((sphere) => {
  sphere.position.x += xOffset;
  sphere.position.z += zOffset;
});

// Set up orbit controls to rotate the scene
const controls = new OrbitControls(camera, renderer.domElement);
// Note: Make sure to update the controls in the animate loop
// controls.update();

// Create an animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the pyramid
  scene.rotation.y += 0.005;

  // Note: Update controls in the animation loop
  controls.update();

  renderer.render(scene, camera);
};

// Handle window resize
window.addEventListener('resize', function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});

animate();