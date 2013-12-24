var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

var projector = new THREE.Projector();

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = getViewportWidth() / getViewportHeight(),
    NEAR = 0.1,
    FAR = 1000;

var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x777777, 0, 30 );

var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.up = new THREE.Vector3( 0, 0, 1 );

var renderer = new THREE.WebGLRenderer();
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
// renderer.shadowMapDebug = true;
renderer.shadowMapAutoUpdate = true;
renderer.setSize(getViewportWidth(), getViewportHeight());
renderer.setClearColor(0x595959, 1);
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.physicallyBasedShading = true;
document.body.appendChild(renderer.domElement);

var field = getField();
scene.add( field );

var ball = getBall();
scene.add( ball );

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add( ambientLight );

var light = getLight(5, 0, 5);
scene.add( light );

var colladaLoader = new THREE.ColladaLoader();
colladaLoader.load('models/goal.dae', function (collada) {
  var whiteGoal = collada.scene;
  var darkGoal = collada.scene.clone();

  whiteGoal.scale.set(whiteGoal.scale.x / 6, whiteGoal.scale.y / 6, whiteGoal.scale.z / 6);
  whiteGoal.position.x += 7.6;
  whiteGoal.position.y += 0.62;
  whiteGoal.rotation.z -= 180 * Math.PI / 180;
  scene.add(whiteGoal);

  darkGoal.scale.set(darkGoal.scale.x / 6, darkGoal.scale.y / 6, darkGoal.scale.z / 6);
  darkGoal.position.x -= 7.6;
  darkGoal.position.y -= 0.62;
  // darkGoal.rotation.z -= 180 * Math.PI / 180;
  scene.add(darkGoal);

  render();
});

window.addEventListener('resize', function(e) {
  renderer.setSize( getViewportWidth(), getViewportHeight() );
  
	camera.aspect = getViewportWidth() / getViewportHeight();
	camera.updateProjectionMatrix();

	render();
});

function getViewportHeight() {
  return window.innerHeight;
}

function getViewportWidth() {
  return window.innerWidth;
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  var timer = Date.now() * 0.0005;

  camera.position.x = Math.cos( timer ) * 10;
  camera.position.z = 5;
  camera.position.y = Math.sin( timer ) * 10;

  camera.lookAt( scene.position );

  stats.update();
	renderer.render( scene, camera );
}

window.onload = function() {
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild( stats.domElement );
  animate();
}

function getBall() {
  var geometry = new THREE.SphereGeometry(0.05,30,30);

  var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({map: texture});

  var object = new THREE.Mesh(geometry, material);

  object.position.z += 0.05;
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

function getLight(x, y, z) {
  // directional lighting
  var light = new THREE.DirectionalLight(0xEEEEEE, 0.7);
  light.target.position.copy( scene.position );
  light.castShadow = true;
  light.shadowDarkness = 0.7;
  light.shadowCameraVisible = false; // will show the wire frame

  light.shadowCameraLeft = -5;
  light.shadowCameraTop = -5;
  light.shadowCameraRight = 5;
  light.shadowCameraBottom = 5;
  light.shadowCameraNear = 0.01;
  light.shadowCameraFar = 100;
  light.shadowBias = -.0001;
  light.shadowMapWidth = light.shadowMapHeight = 2048;

  light.position.set(x, y, z);
  return light;
}