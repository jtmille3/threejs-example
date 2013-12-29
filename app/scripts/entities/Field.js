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

		    var object = new Physijs.BoxMesh(geometry, material, 0);
		    object.castShadow = false;
		    object.receiveShadow = true;

		    this.mesh = object;
		    group.add(this.mesh);

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