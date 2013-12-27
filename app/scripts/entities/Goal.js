define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		init: function(options) {
			this.options = options;
		},

		load: function(renderer, scene) {
			var colladaLoader = new THREE.ColladaLoader();
		    // colladaLoader.load('models/goal.dae', function (collada) {
		    //   var whiteGoal = collada.scene;
		    //   var darkGoal = collada.scene.clone();

		    //   whiteGoal.scale.set(whiteGoal.scale.x / 6, whiteGoal.scale.y / 6, whiteGoal.scale.z / 6);
		    //   whiteGoal.position.x += 7.6;
		    //   whiteGoal.position.y += 0.62;
		    //   whiteGoal.rotation.z -= 180 * Math.PI / 180;
		    //   scene.add(whiteGoal);

		    //   darkGoal.scale.set(darkGoal.scale.x / 6, darkGoal.scale.y / 6, darkGoal.scale.z / 6);
		    //   darkGoal.position.x -= 7.6;
		    //   darkGoal.position.y -= 0.62;
		    //   scene.add(darkGoal);
		    // });
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