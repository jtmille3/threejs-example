define([
	'./Entity'
], function(Entity) {
	return Entity.extend({
		init: function(options) {
			this.options = options;
		},

		load: function(renderer, scene) {
			var boundary = this.getBoundary(2, 2, 1, 1, 0, 0, -90, 0);
			this.mesh = boundary;
		    scene.add( boundary );
		},

		unload: function(renderer, scene) {
			scene.remove(this.mesh);
		}
	});
});