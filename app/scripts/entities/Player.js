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
			
			colladaLoader.load('models/footballer/Running.dae', function (collada) {				
				var mesh = collada.scene;
				mesh.scale.set(mesh.scale.x / 50, mesh.scale.y / 50, mesh.scale.z / 50);
				mesh.position.x += 0.2;
				mesh.position.z += 0.43;
				mesh.rotation.z += 270 * Math.PI / 180;
				scene.add(mesh);
		    });
		},

		unload: function(renderer, scene) {
		}
	});
});