var scene, camera, renderer, world, ball, sphereBody;

require([
  './SoccerGame'
], function(SoccerGame) {
  
  if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
  } else {
    game = new SoccerGame();
    game.start();
    // init();
    // start game
  }

  function init() {
    var topBoundary = getBoundary(0, 4.5, 0);
    scene.add( topBoundary );
    var bottomBoundary = getBoundary(0, -4.5, 0);
    scene.add( bottomBoundary );
    var leftBoundary = getBoundary(8, 0, 90 * Math.PI / 180);
    scene.add( leftBoundary );
    var rightBoundary = getBoundary(-8, 0, 90 * Math.PI / 180);
    scene.add( rightBoundary );

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
  }

  function getBoundary(x, y, y_rotation) {
    var geometry = new THREE.PlaneGeometry(20,20);

    var material = new Physijs.createMaterial(
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        wireframe: true
      }), 
      1.0, // friction
      1.0  // restitution
    );

    var object = new Physijs.BoxMesh(geometry, material, 0);
    object.castShadow = false;
    object.receiveShadow = true;
    object.position.x += x;
    object.position.y += y;
    object.rotation.x += 90 * Math.PI / 180;
    object.rotation.y += y_rotation;

    return object;
  }
});