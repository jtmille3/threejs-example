define([
], function() {
	return Class.extend({
		init: function() {
			this.remove = false;
		},

		load: function(renderer) {

		},

		unload: function(renderer) {

		},

		update: function() {
		},

		destroy: function() {
			this.remove = true;
		}
	});
});