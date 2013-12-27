define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		load: function(renderer, scene) {
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

		    var object = new Physijs.PlaneMesh(geometry, material, 0);
		    object.castShadow = false;
		    object.receiveShadow = true;

		    this.mesh = object;
		    scene.add(this.mesh);

		    var topBoundary = this.getBoundary(0, 4.5, 0);
		    scene.add( topBoundary );
		    var bottomBoundary = this.getBoundary(0, -4.5, 0);
		    scene.add( bottomBoundary );
		    var leftBoundary = this.getBoundary(8, 0, 90 * Math.PI / 180);
		    scene.add( leftBoundary );
		    var rightBoundary = this.getBoundary(-8, 0, 90 * Math.PI / 180);
		    scene.add( rightBoundary );
		},

		getBoundary: function(x, y, y_rotation) {
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
		  },

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		},

		update: function(input) {
			// nothing
		}
	});
});