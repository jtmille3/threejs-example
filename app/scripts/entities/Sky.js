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
        this.mesh = skyBox;
        scene.add( skyBox );
    },

    unload: function(renderer, scene) {
      // this.scene.remove(this.mesh);
    }
  });
});