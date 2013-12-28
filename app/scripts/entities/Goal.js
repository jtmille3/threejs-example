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
				var topBoundary = that.getBoundary(1.25, 0.45, 0.45 / 2, 1.25 / 2, 0.43, 0, 0, 90);
			    var backBoundary = that.getBoundary(1.25, 0.43, 0, 1.25 / 2, 0.43 / 2, 0, 90, 90);
			    var leftBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 0, 0.43 / 2, -90, 0, 0);
			    var rightBoundary = that.getBoundary(0.45, 0.43, 0.45 / 2, 1.25, 0.43 / 2, -90, 0, 0);

				var goal = collada.scene;

				goal.scale.set(goal.scale.x / 6, goal.scale.y / 6, goal.scale.z / 6);
				
				goal.position.x += that.options.px;
				topBoundary.position.x += that.options.px;
				backBoundary.position.x += that.options.px;
				leftBoundary.position.x += that.options.px;
				rightBoundary.position.x += that.options.px;

				goal.position.y += that.options.py;
				topBoundary.position.y += that.options.py;
				backBoundary.position.y += that.options.py;
				leftBoundary.position.y += that.options.py;
				rightBoundary.position.y += that.options.py;
				
				goal.rotation.z += that.options.rz * Math.PI / 180;
				topBoundary.rotation.z += that.options.rz * Math.PI / 180;
				backBoundary.rotation.z += that.options.rz * Math.PI / 180;
				leftBoundary.rotation.z += that.options.rz * Math.PI / 180;
				rightBoundary.rotation.z += that.options.rz * Math.PI / 180;

				that.mesh = goal;

				scene.add( topBoundary );
				scene.add( backBoundary );
				scene.add( leftBoundary );
				scene.add( rightBoundary );
		        // scene.add(goal);
		    });
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});