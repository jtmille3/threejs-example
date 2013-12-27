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
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		},

		update: function(input) {
			// nothing
		}
	});
});