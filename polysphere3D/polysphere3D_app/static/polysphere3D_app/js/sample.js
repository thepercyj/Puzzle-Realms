var canvas;

var scenes = [], camera, renderer, emptyScene;

init();
animate();

function init() {

  canvas = document.getElementById( "c" );

  camera = new THREE.PerspectiveCamera( 75, 1, 0.1, 100 );
  camera.position.z = 1.5;

  var geometries = [
    new THREE.BoxGeometry( 1, 1, 1 ),
    new THREE.SphereGeometry( 0.5, 12, 12 ),
    new THREE.DodecahedronGeometry( 0.5 ),
    new THREE.CylinderGeometry( 0.5, 0.5, 1, 12 ),
  ];

  var template = document.getElementById("template").text;
  var content = document.getElementById("content");

  var emptyScene = new THREE.Scene();

  var numScenes = 100;

  for ( var ii =  0; ii < numScenes; ++ii ) {

    var scene = new THREE.Scene();

    // make a list item.
    var element = document.createElement( "div" );
    element.innerHTML = template;
    element.className = "list-item";

    // Look up the element that represents the area
    // we want to render the scene
    scene.element = element.querySelector(".scene");
    content.appendChild(element);

    // add one random mesh to each scene
    var geometry = geometries[ geometries.length * Math.random() | 0 ];
    var material = new THREE.MeshLambertMaterial( { color: randColor() } );

    scene.add( new THREE.Mesh( geometry, material ) );

    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0.5, 0.8, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( -0.5, -0.8, -1 );
    scene.add( light );

    scenes.push( scene );
  }


  renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
  renderer.setClearColor( 0xFFFFFF );

}

function updateSize() {

  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  if ( canvas.width !== width || canvas.height != height ) {

    renderer.setSize ( width, height, false );

  }

}

function animate() {

  render();

  requestAnimationFrame( animate );
}

function render() {

  updateSize();

  canvas.style.transform = `translateY(${window.scrollY}px`;

  renderer.setClearColor( 0xFFFFFF );
  renderer.clear( true );
  renderer.setClearColor( 0xE0E0E0 );

  renderer.setScissorTest( true );
  scenes.forEach( function( scene ) {
    // so something moves
    scene.children[0].rotation.x = Date.now() * 0.00111;
    scene.children[0].rotation.z = Date.now() * 0.001;

    // get the element that is a place holder for where we want to
    // draw the scene
    var element = scene.element;

    // get its position relative to the page's viewport
    var rect = element.getBoundingClientRect();

    // check if it's offscreen. If so skip it
    if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
       rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
      return;  // it's off screen
    }

    // set the viewport
    var width  = rect.right - rect.left;
    var height = rect.bottom - rect.top;
    var left   = rect.left;
    var top    = rect.top;

    renderer.setViewport( left, top, width, height );
    renderer.setScissor( left, top, width, height );

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.render( scene, camera );

  } );
  renderer.setScissorTest( false );

}

function rand( min, max ) {
  if ( max == undefined ) {
    max = min;
    min = 0;
  }

  return Math.random() * ( max - min ) + min;
}

function randColor() {
  var colors = [ rand( 256 ), rand ( 256 ), rand( 256 ) ];
  colors[ Math.random() * 3 | 0 ] = 255;
  return ( colors[0] << 16 ) |
       ( colors[1] <<  8 ) |
       ( colors[2] <<  0 ) ;
}