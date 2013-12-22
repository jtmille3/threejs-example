var projector = new THREE.Projector();

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = getViewportWidth() / getViewportHeight(),
    NEAR = 0.1,
    FAR = 1000;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera.position.set(0, -10, 5);
camera.lookAt(scene.position);
// camera.position.y -= 20;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(getViewportWidth(), getViewportHeight());
document.body.appendChild(renderer.domElement);

var field = getField();
scene.add( field );

var ball = getBall();
ball.position.z += 0.5;
scene.add( ball );

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x9999EE);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0x999999);
directionalLight.position.set(ASPECT, 1, 2).normalize();
scene.add(directionalLight);

window.addEventListener('resize', function(e) {
	camera.aspect = getViewportWidth() / getViewportHeight();
	camera.updateProjectionMatrix();

	renderer.setSize( getViewportWidth(), getViewportHeight() );

	render();
});

function mouseMove(e){
  mouse2D.x = ( (e.pageX-canvas.offsetParent.offsetLeft) / canvas.clientWidth ) * 2 - 1;
  mouse2D.y = - ( (e.pageY-canvas.offsetParent.offsetTop) / canvas.clientHeight ) * 2 + 1;

  if (selected) {
    var ray = projector.pickingRay(mouse2D, PGL._camera).ray;
    var targetPos = ray.direction.clone().addSelf(ray.origin);
    targetPos.subSelf(_offset);

    obj.position.x = initPos.x + targetPos.x;
    obj.position.y = initPos.y + targetPos.y;
  }
}

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

function getBall() {
  var geometry = new THREE.SphereGeometry(0.5,30,30);

  var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial({map: texture});

  var sphere = new THREE.Mesh(geometry, material);

  return sphere;
}

function getField() {
  var geometry = new THREE.PlaneGeometry(10,10);

  // var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
  // texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshBasicMaterial({color: '#006600'});

  var plane = new THREE.Mesh(geometry, material);

  return plane;
}