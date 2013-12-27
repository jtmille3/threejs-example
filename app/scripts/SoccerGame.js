require([
  './utilities/AssetManager',
  './GameEngine',
  './scenes/SoccerScene'
], function(AssetManager, GameEngine, SoccerScene) {
    if ( ! Detector.webgl ) {
      Detector.addGetWebGLMessage();
    } else {
      var gameEngine = new GameEngine();
      gameEngine.addScene(new SoccerScene());

      // make global just because
      var assets = new AssetManager();

      assets.queueDownload('images/ball.jpg');
      assets.queueDownload('images/field.jpg');
      
      // assets.queueSound('thud', 'audio/thud.wav');
      
      assets.downloadAll(function() {
          gameEngine.start();
          gameEngine.selectScene(0);
      });
    }
});