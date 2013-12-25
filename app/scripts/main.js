if ( ! Detector.webgl ) {
  Detector.addGetWebGLMessage();
} else {
  init();
}

var clock, stats, scene, camera, renderer, world, ball, sphereBody;

function init() {
  clock = new THREE.Clock(true);

  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  world = new CANNON.World();
  world.gravity.set(0,0,-9.82);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  var projector = new THREE.Projector();

  // set some camera attributes
  var VIEW_ANGLE = 45,
      ASPECT = getViewportWidth() / getViewportHeight(),
      NEAR = 0.1,
      FAR = 1000;

  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog( 0x777777, 0, 30 );

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.up = new THREE.Vector3( 0, 0, 1 );

  renderer = new THREE.WebGLRenderer();
  /* this will slow down the rendering by half without a GPU */
  // renderer.shadowMapEnabled = true;
  // renderer.shadowMapSoft = true;
  // renderer.shadowMapDebug = true;
  // renderer.shadowMapAutoUpdate = true;
  renderer.setSize(getViewportWidth(), getViewportHeight());
  renderer.setClearColor(0x191919, 1);
  document.body.appendChild(renderer.domElement);

  // Materials
  var groundMaterial = new CANNON.Material("groundMaterial");
  var groundContactMaterial = new CANNON.ContactMaterial(groundMaterial, 
                                                    groundMaterial,
                                                    1.0, // friction coefficient
                                                    0.7  // restitution
                                                    );
  // Adjust constraint equation parameters for ground/ground contact
  groundContactMaterial.contactEquationStiffness = 1e8;
  groundContactMaterial.contactEquationRegularizationTime = 5;
  groundContactMaterial.frictionEquationStiffness = 1e8;
  groundContactMaterial.frictionEquationRegularizationTime = 5;

  // Add contact material to the world
  world.addContactMaterial(groundContactMaterial);

  var field = getField(groundMaterial);
  scene.add( field );

  ball = getBall();
  scene.add( ball );

  var mass = 1, radius = 0.05;
  var sphereShape = new CANNON.Sphere(radius); // Step 1
  sphereBody = new CANNON.RigidBody(mass, sphereShape, groundMaterial); // Step 2
  sphereBody.position.set(0,0,0.05);
  sphereBody.applyImpulse(new CANNON.Vec3(1, 0, 3 ), sphereBody.position);
  sphereBody.linearDamping = sphereBody.angularDamping = 0.3;
  world.add(sphereBody); // Step 3

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
    scene.add(darkGoal);

    render();
  });

  window.addEventListener('resize', function(e) {
    renderer.setSize( getViewportWidth(), getViewportHeight() );
    
  	camera.aspect = getViewportWidth() / getViewportHeight();
  	camera.updateProjectionMatrix();

  	render();
  });

  window.onload = function() {  
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );
    render(); // warm it up?
    animate();
  }
}

function getViewportHeight() {
  return window.innerHeight;
}

function getViewportWidth() {
  return window.innerWidth;
}

function animate() {
  requestAnimationFrame( animate );

  /* This will be a problem for laggy games */
  var delta = clock.getDelta();
  if(delta < 0.1) // smooth it out :P
    world.step(delta);

  render();
  stats.update();
}

function render() {
  var timer = Date.now() * 0.0001;

  camera.position.x = Math.cos( timer ) * 5;
  camera.position.z = 2;
  camera.position.y = Math.sin( timer ) * 5;

  camera.lookAt( scene.position );

  sphereBody.position.copy(ball.position); // position
  sphereBody.quaternion.copy(ball.quaternion); // for orientation

  renderer.render( scene, camera );
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

function getField(groundMaterial) {
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

  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.RigidBody(0, groundShape, groundMaterial);
  world.add(groundBody);

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