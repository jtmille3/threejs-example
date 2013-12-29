define([
	'./Entity',
	'./Ball'
], function(Entity, Ball) {
	return Entity.extend({
		init: function(options) {
			this.options = options;
		},

		load: function(renderer, scene) {
			var colladaLoader = new THREE.ColladaLoader();

			var that = this;
			
			colladaLoader.load('models/goal.dae', function (collada) {
				this.goal = new Physijs.BoxMesh( 
						new THREE.CubeGeometry( 0.0, 0.0, 0.0 ), 
						new THREE.MeshBasicMaterial({ 
							transparent: true, 
							opacity: 0.0 
						}) 
					);
				this.hitBox = new Physijs.BoxMesh( 
						new THREE.CubeGeometry( 0.0, 0.0, 0.0 ), 
						new THREE.MeshBasicMaterial({ 
							transparent: true, 
							opacity: 0.0 
						}) 
					);

				var topBoundary = that.getBoundary(1.25, 0.45, 0.45 / 2, 1.25 / 2, 0.43, 0, 0, 90);
				this.goal.add(topBoundary);
				
				var backBoundary = that.getBoundary(1.25, 0.43, 0, 1.25 / 2, 0.43 / 2, 0, 90, 90);
				this.goal.add(backBoundary);
			    
			    var leftBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 0, 0.43 / 2, -90, 0, 0);
			    this.goal.add(leftBoundary);
			    
			    var rightBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 1.25, 0.43 / 2, -90, 0, 0);
				this.goal.add(rightBoundary);
				
				var mesh = collada.scene;
				mesh.scale.set(mesh.scale.x / 6, mesh.scale.y / 6, mesh.scale.z / 6);
				this.goal.add(mesh);

				this.goal.position.x += that.options.px;
				this.goal.position.y += that.options.py;
				this.goal.rotation.z += that.options.rz * Math.PI / 180;

				var scoreBoundary = that.getBoundary(1.25, 0.43, 0.45 - 0.11, 1.25 / 2, 0.43 / 2, 0, 90, 90);
				// https://github.com/chandlerprall/Physijs/issues/82
			    // register ghost collision
			    scoreBoundary._physijs.collision_flags = 4;
				this.hitBox.add(scoreBoundary);
				this.hitBox.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
				    if(other_object.entity instanceof Ball) {
				    	console.log('Goal!!!!');
				    }
				});
				this.hitBox.position.x += that.options.px;
				this.hitBox.position.y += that.options.py;
				this.hitBox.rotation.z += that.options.rz * Math.PI / 180;

				scene.add(this.goal);
				scene.add(this.hitBox);
		    });
		},

		unload: function(renderer, scene) {
			scene.remove(this.goal);
			scene.remove(this.hitBox);
		}
	});
});