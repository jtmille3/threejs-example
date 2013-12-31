define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		load: function(renderer, scene) {
			var group = new Physijs.BoxMesh( 
						new THREE.CubeGeometry( 0.0, 0.0, 0.0 ), 
						new THREE.MeshBasicMaterial({ 
							transparent: true, 
							opacity: 0.0 
						}) 
					);

			// var floorGeometry = new THREE.PlaneGeometry(1600,900);
			// var floorTexture = new THREE.ImageUtils.loadTexture( 'images/dirt_tx.png' );
			// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
			// floorTexture.repeat.x = 1;
   //          floorTexture.repeat.y = 1;
   //          floorTexture.offset.x = 0;
   //          floorTexture.offset.y = 0;
   //          floorTexture.needsUpdate = true;
			// var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );

			// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			// //floor.scale.x = floor.scale.y = floor.scale.z = 0.01;
			// floor.position.z += -0.01;
			// // floor.rotation.x = Math.PI / 2;
			// group.add(floor);

			var fieldGeometry = new THREE.PlaneGeometry(16,9);

		    var fieldTexture = THREE.ImageUtils.loadTexture('images/field.jpg');
		    fieldTexture.anisotropy = renderer.getMaxAnisotropy();

		    var fieldMaterial = new Physijs.createMaterial(
		      new THREE.MeshPhongMaterial({
		        map: fieldTexture,
		        ambient: 0x030303, 
		        specular: 0x00FF00, 
		        shininess: 1, 
		        shading: THREE.FlatShading
		      }), 
		      1.0, // friction
		      1.0  // restitution
		    );

		    var field = new Physijs.BoxMesh(fieldGeometry, fieldMaterial, 0);
		    // field.position.z += -0.02;
		    field.castShadow = false;
		    field.receiveShadow = true;

		    group.add(field);

		    var topBoundary = this.getBoundary(40, 40, 0, 4.5, 0, 90, 0, 0);
		    group.add( topBoundary );
		    var bottomBoundary = this.getBoundary(40, 40, 0, -4.5, 0, 90, 0, 0);
		    group.add( bottomBoundary );
		    var leftBoundary = this.getBoundary(40, 40, 8, 0, 0, 90, 90, 0);
		    group.add( leftBoundary );
		    var rightBoundary = this.getBoundary(40, 40, -8, 0, 0, 90, 90, 0);
		    group.add( rightBoundary );

		    scene.add(group);
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});