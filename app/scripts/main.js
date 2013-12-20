var WIDTH = document.documentElement.clientWidth,
    HEIGHT = document.documentElement.clientHeight;

var projector = new THREE.Projector();

// set some camera attributes
var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 100;


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(0.5,30,30);

var texture = THREE.ImageUtils.loadTexture('images/soccer2.jpg');
texture.anisotropy = renderer.getMaxAnisotropy();

var material = new THREE.MeshLambertMaterial({map: texture});

var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x9999EE);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0x999999);
directionalLight.position.set(ASPECT, 1, 2).normalize();
scene.add(directionalLight);

camera.position.z = 10;

control = new THREE.TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', render );
control.attach( sphere );
scene.add( control );

var grid = new THREE.GridHelper( 10, 1 );
grid.rotation.x += 0.5;
grid.rotation.y += 1.0;
scene.add( grid );

window.addEventListener('resize', function(e) {
	camera.aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( document.documentElement.clientWidth, document.documentElement.clientHeight );

	render();
});

window.addEventListener( 'keydown', function ( event ) {
    //console.log(event.which);
    switch ( event.keyCode ) {
      case 81: // Q
        control.setSpace( control.space == "local" ? "world" : "local" );
        break;
      case 87: // W
        control.setMode( "translate" );
        break;
      case 69: // E
        control.setMode( "rotate" );
        break;
      case 82: // R
        control.setMode( "scale" );
        break;
	case 187:
	case 107: // +,=,num+
		control.setSize( control.size + 0.1 );
		break;
	case 189:
	case 10: // -,_,num-
		control.setSize( Math.max(control.size - 0.1, 0.1 ) );
		break;
    }            
});

function render() {
	control.update();
	renderer.render( scene, camera );
}

render();