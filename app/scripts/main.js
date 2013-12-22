var projector = new THREE.Projector();

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = getViewportWidth() / getViewportHeight(),
    NEAR = 0.1,
    FAR = 1000;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var camera_offset = -8.0
camera.position.set(0, camera_offset, camera_offset / -2.0);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
renderer.setSize(getViewportWidth(), getViewportHeight());
document.body.appendChild(renderer.domElement);

var field = getField();
scene.add( field );

var ball = getBall();
scene.add( ball );

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

var light_x = 5, light_y = 0, light_z = 5;

var directionalLight = getDirectionalLight(light_x, light_y, light_z);
scene.add(directionalLight);

var light = getLight();
light.position.set(light_x, light_y, light_z);
scene.add(light);

window.addEventListener('resize', function(e) {
	camera.aspect = getViewportWidth() / getViewportHeight();
	camera.updateProjectionMatrix();

	renderer.setSize( getViewportWidth(), getViewportHeight() );

	render();
});

function render() {
	renderer.render( scene, camera );
}

function getViewportHeight() {
  return window.innerHeight;
}

function getViewportWidth() {
  return window.innerWidth;
}

window.onload = function() {
  render();
}

function getLight() {
  var geometry = new THREE.SphereGeometry(0.2,30,30);

  var material = new THREE.MeshBasicMaterial({color: 0xFFFF00});

  var sphere = new THREE.Mesh(geometry, material);

  return sphere;
}

function getBall() {
  var geometry = new THREE.SphereGeometry(0.1,30,30);

  var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({map: texture});

  var object = new THREE.Mesh(geometry, material);

  object.position.z += 0.1;
  object.castShadow = true;
  object.receiveShadow = false;

  return object;
}

function getField() {
  var geometry = new THREE.PlaneGeometry(16,9);

  var texture = THREE.ImageUtils.loadTexture('images/field.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({
    map: texture,
    ambient: 0x030303, 
    specular: 0x00FF00, 
    shininess: 5, 
    shading: THREE.FlatShading
  });

  var object = new THREE.Mesh(geometry, material);

  object.castShadow = false;
  object.receiveShadow = true;

  return object;
}

function getDirectionalLight(x, y, z) {
  // directional lighting
  var directionalLight = new THREE.DirectionalLight(0xEEEEEE, 0.7);
  directionalLight.target.position.copy( scene.position );
  directionalLight.castShadow = true;
  directionalLight.shadowDarkness = 0.7;
  directionalLight.shadowCameraVisible = true;

  directionalLight.shadowCameraLeft = -5;
  directionalLight.shadowCameraTop = -5;
  directionalLight.shadowCameraRight = 5;
  directionalLight.shadowCameraBottom = 5;
  directionalLight.shadowCameraNear = 0.01;
  directionalLight.shadowCameraFar = 100;
  directionalLight.shadowBias = -.0001;
  directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 2048;

  directionalLight.position.set(x, y, z);
  return directionalLight;
}