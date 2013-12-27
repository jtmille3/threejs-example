define([
	'./Scene',
	'./Field',
	'./Ball'
], function(Scene, Field, Ball) {
	return Scene.extend({

		init: function() {
			this._super();

			// set some camera attributes
		    var VIEW_ANGLE = 45,
		        ASPECT = window.innerWidth / window.innerHeight,
		        NEAR = 0.1,
		        FAR = 1000;

		    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		    this.camera.up = new THREE.Vector3( 0, 0, 1 );

			this.scene = new Physijs.Scene({
		      fixedTimeStep: 1 / 60
		    });
		    this.scene.setGravity(new THREE.Vector3( 0, 0, -9.8 ));
		    // this.Scene.fog = new THREE.Fog( 0x777777, 0, 20 );

		    // directional lighting
		    var directionalLight = new THREE.DirectionalLight(0xEEEEEE, 0.7);
		    directionalLight.target.position.copy( this.scene.position );
		    directionalLight.castShadow = true;
		    directionalLight.shadowDarkness = 0.7;
		    directionalLight.shadowCameraVisible = false; // will show the wire frame

		    directionalLight.shadowCameraLeft = directionalLight.shadowCameraTop = -5;
		    directionalLight.shadowCameraRight = directionalLight.shadowCameraBottom = 5;
		    directionalLight.shadowCameraNear = 0.01;
		    directionalLight.shadowCameraFar = 100;
		    directionalLight.shadowBias = -.0001;
		    directionalLight.shadowMapWidth = directionalLight.shadowMapHeight = 2048;

		    directionalLight.position.set(5, 0, 5);
		    this.addLight( directionalLight );

		    var ambientLight = new THREE.AmbientLight(0x404040);
    		this.addLight( ambientLight );

    		// add ball and field...
			this.field = new Field();
			this.addEntity(this.field);

			this.ball = new Ball();
			this.addEntity(this.ball);
		},

		load: function(renderer) {
			var that = this;
			window.addEventListener('mousedown', function() {
				that.input['click'] = true;
			});

			window.addEventListener('mouseup', function() {
				that.input['click'] = false;
			});

		    var that = this;
		    this.scene.addEventListener('update', function() {
		      that.scene.simulate( undefined, 1 );
		      physic_stats.update();
		    });
			
			this._super(renderer);

		    this.scene.simulate();
		},

		unload: function() {
			window.removeEventListener('mousedown');
			window.removeEventListener('mouseup');

			this.scene.removeEventListener('update');

			this._super();
		},

		update: function() {
			this._super();
			// var timer = Date.now() * 0.0001;

		    this.camera.position.x = this.ball.mesh.position.x + 5; // Math.cos( timer ) * 5;
		    this.camera.position.z = 3;
		    // this.camera.position.y = Math.sin( timer ) * 5;

		    this.camera.lookAt ( this.ball.mesh.position );
		},

		resize: function(width, height) {
			this._super();

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
		}
	});
});