// the following code is from
//    http://catchvar.com/threejs-animating-blender-models
var t = 0;
var clock = new THREE.Clock();
var playerAnimation;
var lastFrame = 0;
var startFrame = 0;
var totalFrames = 7;

define([
	'./Entity',
	'./Ball'
], function(Entity, Ball) {
	return Entity.extend({
		init: function(options) {
			this.options = options;
		},

		load: function(renderer, scene) {
			var that = this;

			// var colladaLoader = new THREE.ColladaLoader();
			// colladaLoader.load('models/footballer/Running.dae', function (collada) {				
			// 	that.mesh = collada.scene;
			// 	that.skins = collada.skins;
			// 	that.animations = collada.animations;
			// 	that.mesh.scale.set(that.mesh.scale.x / 50, that.mesh.scale.y / 50, that.mesh.scale.z / 50);
			// 	that.mesh.position.x += 0.2;
			// 	that.mesh.position.z += 0.43;
			// 	that.mesh.rotation.z += 270 * Math.PI / 180;
			// 	scene.add(that.mesh);

			// 	THREE.AnimationHandler.add(that.animations[0]);
			// 	playerAnimation = new THREE.Animation(collada.animations[0].node, "Action", THREE.AnimationHandler.CATMULLROM);
   //          	playerAnimation.play();
		 //    });

		    var loader = new THREE.JSONLoader();
			loader.load( 'models/footballer/Running.js', function(geometry, materials) {that.createSkinnedMesh(geometry, materials, scene);});
		},

		createSkinnedMesh: function(geometry, materials, scene) { 
		    var skinnedMesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials)); 
		    skinnedMesh.scale.x = skinnedMesh.scale.y = skinnedMesh.scale.z = 0.01;
		    skinnedMesh.rotation.x += 90 * Math.PI / 180;
		    scene.add(skinnedMesh);

		    var materials = skinnedMesh.material.materials; 
		    for (var i = 0,length = materials.length; i < length; i++) { 
		        var mat = materials[i]; mat.skinning = true; 
		    }  

		    /*
             * It is required for the animation name to be recognisable to
             * add animation data from the geometry to THREE.AnimationHandler
             * (currently this is the only way i found animations possible)
             * and probably this is the most efficient way to deal with animations
             */ 
            THREE.AnimationHandler.add(skinnedMesh.geometry.animations[0]);
            
            /*
             * the animation global variable is set to instance of 
             * THREE.Animation 
             * */
            // The animation constructor takes 3 arguments: 
            // 1) The SkinnedMesh instance to be animated
            // 2) The animation name exported to the JSON file
            // 3) Interpolation mode: could be: 
            //      THREE.AnimationHandler.LINEAR or
            //      THREE.AnimationHandler.CATMULLROM
            playerAnimation = new THREE.Animation(skinnedMesh, "Action", THREE.AnimationHandler.CATMULLROM);
            playerAnimation.play();
		},

		unload: function(renderer, scene) {
		},

		update: function(input) {
			// animate Collada model
			//if(playerAnimation)
			//	playerAnimation.update(clock.getDelta());

				// var delta = clock.getDelta();
				// if ( t > 1 ) t = 0;
				// if ( this.skins && this.skins[0] )
				// {
				// this.skins[0].morphTargetInfluences[lastFrame] = 0;
				// var currentFrame = startFrame + Math.floor(t*totalFrames);
				// this.skins[0].morphTargetInfluences[currentFrame] = 1;
				// t += delta;
				// lastFrame = currentFrame;
				// }
		}
	});
});