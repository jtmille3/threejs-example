define([
	'./Entity'
], function(Entity) {
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
				var backBoundary = that.getBoundary(1.25, 0.43, 0, 1.25 / 2, 0.43 / 2, 0, 90, 90);
			    var leftBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 0, 0.43 / 2, -90, 0, 0);
			    var rightBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 1.25, 0.43 / 2, -90, 0, 0);

				var goal = collada.scene;
				goal.scale.set(goal.scale.x / 6, goal.scale.y / 6, goal.scale.z / 6);
				
				group.add(goal);
				group.add(topBoundary);
				group.add(backBoundary);
				group.add(leftBoundary);
				group.add(rightBoundary);
				
				group.position.x += that.options.px;
				group.position.y += that.options.py;
				group.rotation.z += that.options.rz * Math.PI / 180;

				that.mesh = group;
				scene.add(that.mesh);
		    });
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});