define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		load: function(renderer, scene) {
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

		    object.setDamping(0.7, 0.7);

		    this.physijs = object;
		    scene.add(this.physijs);
		},

		unload: function(renderer, scene) {
			scene.remove(this.phyijs);
		},

		update: function() {
			// nothing
		},

		kick: function() {
			this.physijs.applyCentralImpulse(new THREE.Vector3(10, 0, 5).applyProjection(this.physijs.matrix)); // goal test
    		// ball.applyCentralImpulse(new THREE.Vector3(20, 20, 0).applyProjection(ball.matrix)); // test ob
		}
	});
});