define([
	'./Scene',
	'./Field',
	'./Ball'
], function(Scene, Field, Ball) {
	return Scene.extend({
		init: function() {
			this._super();

			this.setup();
		},

		setup: function() {
			var that = this;
			window.addEventListener('mousedown', function() {
				that.input['click'] = true;
			});

			window.addEventListener('mouseup', function() {
				that.input['click'] = false;
			});

			this.scene = new Physijs.Scene({
		      fixedTimeStep: 1 / 60
		    });
		    this.scene.setGravity(new THREE.Vector3( 0, 0, -9.8 ));
		    // this.Scene.fog = new THREE.Fog( 0x777777, 0, 20 );

		    var that = this;
		    this.scene.addEventListener('update', function() {
		      that.scene.simulate( undefined, 1 );
		      physic_stats.update();
		    });

		    // set some camera attributes
		    var VIEW_ANGLE = 45,
		        ASPECT = window.innerWidth / window.innerHeight,
		        NEAR = 0.1,
		        FAR = 1000;

		    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		    this.camera.up = new THREE.Vector3( 0, 0, 1 );

		    // directional lighting
		    var light = new THREE.DirectionalLight(0xEEEEEE, 0.7);
		    light.target.position.copy( this.scene.position );
		    light.castShadow = true;
		    light.shadowDarkness = 0.7;
		    light.shadowCameraVisible = false; // will show the wire frame

		    light.shadowCameraLeft = light.shadowCameraTop = -5;
		    light.shadowCameraRight = light.shadowCameraBottom = 5;
		    light.shadowCameraNear = 0.01;
		    light.shadowCameraFar = 100;
		    light.shadowBias = -.0001;
		    light.shadowMapWidth = light.shadowMapHeight = 2048;

		    light.position.set(5, 0, 5);
		    this.scene.add( light );

		    var ambientLight = new THREE.AmbientLight(0x404040);
    		this.scene.add( ambientLight );

			// add ball and field...
			this.field = new Field();
			this.addEntity(this.field);

			this.ball = new Ball();
			this.addEntity(this.ball);
			
			this.scene.simulate();
		},

		draw: function(renderer) {
			this._super(renderer);

			// var timer = Date.now() * 0.0001;

		    this.camera.position.x = this.ball.physijs.position.x + 5; // Math.cos( timer ) * 5;
		    this.camera.position.z = 3;
		    // this.camera.position.y = Math.sin( timer ) * 5;

		    this.camera.lookAt ( this.ball.physijs.position );

            renderer.render( this.scene, this.camera );
            render_stats.update();
		},

		resize: function(renderer) {
			this._super();

			this.renderer.setSize( window.innerWidth, window.innerHeight );

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
		}
	});
});