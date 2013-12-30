define([
  './Entity'
], function(Entity) {
  return Entity.extend({
    load: function(renderer, scene) {
        var path = "images/";
        var format = '.jpg';

        var imagePrefix = "images/";
        var directions  = ["px", "nx", "py", "ny", "pz", "nz"];
        var imageSuffix = ".jpg";
        var skyGeometry = new THREE.CubeGeometry( 1000, 1000, 1000 ); 
        
        var materialArray = [];
        for (var i = 0; i < 6; i++)
          materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
          }));
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        skyBox.rotation.x += 90 * Math.PI / 180;
        scene.add( skyBox );

        // var urls = [
        //   path + 'px' + format, path + 'nx' + format,
        //   path + 'py' + format, path + 'ny' + format,
        //   path + 'pz' + format, path + 'nz' + format
        //  ];

        // var textureCube = THREE.ImageUtils.loadTextureCube(urls);

        // var shader = THREE.ShaderLib["cube"];
        // shader.uniforms["tCube"].value = textureCube;

        // // We're inside the box, so make sure to render the backsides
        // // It will typically be rendered first in the scene and without depth so anything else will be drawn in front
        // var material = new THREE.ShaderMaterial({
        //   fragmentShader : shader.fragmentShader,
        //   vertexShader   : shader.vertexShader,
        //   uniforms       : shader.uniforms,
        //   depthWrite     : false,
        //   side           : THREE.BackSide
        // });

        // // The box dimension size doesn't matter that much when the camera is in the center.  Experiment with the values.
        // var skyboxMesh = new THREE.Mesh( new THREE.CubeGeometry(1000, 1000, 1000, 1, 1, 1), material );
        // skyboxMesh.up = new THREE.Vector3( 0, 0, 1 );
        // skyboxMesh.rotation.x += 90 * Math.PI / 180;
        // skyboxMesh.renderDepth = -10;

        // this.mesh = skyboxMesh;

        // scene.add(skyboxMesh);
    },

    unload: function(renderer, scene) {
      scene.remove(this.mesh);
    }
  });
});