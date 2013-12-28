define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		init: function(options) {
			this.options = options;
		},

		load: function(renderer, scene) {
			var geometry = new THREE.SphereGeometry(this.options.radius,30,30);

		    var texture = THREE.ImageUtils.loadTexture('images/ball.jpg');
		    texture.anisotropy = renderer.getMaxAnisotropy();

		    var material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
		        map: texture
		      }),
		       1.0,  // friction
		      .6   // restitution
		    );

		    var object = new Physijs.SphereMesh(geometry, material, 1);

		    object.position.z += this.options.radius; // offset by radius so it sits on top
		    object.castShadow = true;
		    object.receiveShadow = false;

		    this.mesh = object;
		    scene.add(this.mesh);

		    object.setDamping(0.7, 0.7); // must set after adding to the scene
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		},

		update: function(input) {
			if(input['click'] && !this.kicked) {
				this.kick();
				this.kicked = true;
				console.log('Kick Me!');
			} else if (!input['click']) {
				this.kicked = false;
			}
		},

		kick: function() {
			this.mesh.applyCentralImpulse(new THREE.Vector3(13, 0, 5).applyProjection(this.mesh.matrix)); // goal test
    		// this.mesh.applyCentralImpulse(new THREE.Vector3(30, 30, 0).applyProjection(this.mesh.matrix)); // test ob
		}
	});
});