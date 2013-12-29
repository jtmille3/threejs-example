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
				var group = new Physijs.BoxMesh( 
						new THREE.CubeGeometry( 0.0, 0.0, 0.0 ), 
						new THREE.MeshBasicMaterial({ 
							transparent: true, 
							opacity: 0.0 
						}) 
					);

				var topBoundary = that.getBoundary(1.25, 0.45, 0.45 / 2, 1.25 / 2, 0.43, 0, 0, 90);
				group.add(topBoundary);
				
				var backBoundary = that.getBoundary(1.25, 0.43, 0, 1.25 / 2, 0.43 / 2, 0, 90, 90);
				group.add(backBoundary);
			    
			    var leftBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 0, 0.43 / 2, -90, 0, 0);
			    group.add(leftBoundary);
			    
			    var rightBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 1.25, 0.43 / 2, -90, 0, 0);
				group.add(rightBoundary);
				
				var goal = collada.scene;
				goal.scale.set(goal.scale.x / 6, goal.scale.y / 6, goal.scale.z / 6);
				group.add(goal);
				
			    var scoreBoundary = that.getBoundary(1.25, 0.43, 0.45 - 0.11, 1.25 / 2, 0.43 / 2, 0, 90, 90);
				group.add(scoreBoundary);

				group.position.x += that.options.px;
				group.position.y += that.options.py;
				group.rotation.z += that.options.rz * Math.PI / 180;

				that.mesh = group;
				scene.add(that.mesh);

				// https://github.com/chandlerprall/Physijs/issues/82
			    // register ghost collision
			    scoreBoundary._physijs.collision_flags = 4;
				scoreBoundary.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
				    if(other_object.entity instanceof Ball) {
				    	console.log('Goal!!!!');
				    }
				});
		    });
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});