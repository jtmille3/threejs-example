define([
], function() {
	return Class.extend({
		init: function() {
			this.entities = [];
			this.input = [];
		},

		addEntity: function(entity) {
            this.entities.push(entity);
        },

        load: function(renderer) {
        	for (var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];
                entity.load(renderer, this.scene);
            }
        },

        unload: function(renderer) {
        	for (var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];
                entity.unload(renderer, this.scene);
            }
        },

		update: function() {
			for (var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];

                if (!entity.remove) {
                    entity.update(this.input);
                }
            }

            for (var i = this.entities.length-1; i >= 0; --i) {
                if (this.entities[i].remove) {
                    this.entities.splice(i, 1);
                }
            }
		},

		draw: function(renderer) {
		},

		resize: function() {

		}
	});
});