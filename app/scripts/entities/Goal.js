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
		      var goal = collada.scene;
		    
		      goal.scale.set(goal.scale.x / 6, goal.scale.y / 6, goal.scale.z / 6);
		      goal.position.x += that.options.px;
		      goal.position.y += that.options.py;
		      goal.rotation.z += that.options.rz * Math.PI / 180;
		      
		      that.mesh = goal;

		      scene.add(goal);
		    });
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});