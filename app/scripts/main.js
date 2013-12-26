if ( ! Detector.webgl ) {
  Detector.addGetWebGLMessage();
} else {
  init();
}

var render_stats, physics_stats, scene, camera, renderer, world, ball, sphereBody;

function init() {
  Physijs.scripts.worker = '/bower_components/physijs/physijs_worker.js';
  Physijs.scripts.ammo = '/bower_components/ammo.js/builds/ammo.js';

  render_stats = new Stats();
  render_stats.setMode(0); // 0: fps, 1: ms

  var projector = new THREE.Projector();

  // set some camera attributes
  var VIEW_ANGLE = 45,
      ASPECT = getViewportWidth() / getViewportHeight(),
      NEAR = 0.1,
      FAR = 1000;

  scene = new Physijs.Scene({
    fixedTimeStep: 1 / 60
  });
  scene.setGravity(new THREE.Vector3( 0, 0, -9.8 ));
  scene.fog = new THREE.Fog( 0x777777, 0, 20 );
  scene.addEventListener('update', function() {
    scene.simulate( undefined, 2 );
    physics_stats.update();
  });

  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.up = new THREE.Vector3( 0, 0, 1 );

  renderer = new THREE.WebGLRenderer({ 
    antialias: true 
  });
  /* this will slow down the rendering by half without a GPU */
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapAutoUpdate = true;
  // renderer.shadowMapDebug = true;
  renderer.setSize(getViewportWidth(), getViewportHeight());
  renderer.setClearColor(0x191919, 1);
  document.body.appendChild(renderer.domElement);

  var field = getField();
  scene.add( field );

  ball = getBall();
  scene.add( ball );
  ball.addEventListener( 'collision', function( other_object, linear_velocity, angular_velocity ) {
      if(other_object === field) {
        
      }
  });
  ball.setDamping(0.7, 0.7);
  ball.applyCentralImpulse(new THREE.Vector3(3, 0, 5).applyProjection(ball.matrix));

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

    animate();
  });

  window.addEventListener('resize', function(e) {
    renderer.setSize( getViewportWidth(), getViewportHeight() );
    
  	camera.aspect = getViewportWidth() / getViewportHeight();
  	camera.updateProjectionMatrix();

  	animate();
  });

  window.onload = function() {  
    // Align top-left
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.left = '0px';
    render_stats.domElement.style.top = '0px';

    document.body.appendChild( render_stats.domElement );

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.body.appendChild( physics_stats.domElement );

    animate();
  }

  scene.simulate();
}

function getViewportHeight() {
  return window.innerHeight;
}

function getViewportWidth() {
  return window.innerWidth;
}

function animate() {
  requestAnimationFrame( animate );
  render();
  render_stats.update();
}

function render() {
  var timer = Date.now() * 0.0001;

  camera.position.x = ball.position.x + 5; // Math.cos( timer ) * 5;
  camera.position.z = 2;
  // camera.position.y = Math.sin( timer ) * 5;

  camera.lookAt( ball.position );

  renderer.render( scene, camera );
}

function getBall() {
  var geometry = new THREE.SphereGeometry(0.05,30,30);

  var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
      map: texture
    }),
     1.0,  // friction
    .6   // restitution
  );

  var object = new Physijs.SphereMesh(geometry, material, 1);

  object.position.z += 0.05;
  object.castShadow = true;
  object.receiveShadow = false;

  return object;
}

function getField() {
  var geometry = new THREE.PlaneGeometry(16,9);

  var texture = THREE.ImageUtils.loadTexture('images/field.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: texture,
      ambient: 0x030303, 
      specular: 0x00FF00, 
      shininess: 1, 
      shading: THREE.FlatShading
    }), 
    1.0, // friction
    1.0  // restitution
  );

  var object = new Physijs.PlaneMesh(geometry, material, 100000000);
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