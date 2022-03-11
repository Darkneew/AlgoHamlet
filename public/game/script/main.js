import MainScene from "./scene.js";

window.onload = () => {

  let match = document.cookie.match(new RegExp('(^| )infos=([^;]+)'));
  if (!match) window.location.replace("/menu");

  const config = { // game configuration
    type: Phaser.AUTO, 
    parent: document.getElementById("container"),
    width: window.innerWidth-30,
    height: window.innerHeight-30,
    scene: MainScene,
    backgroundColor: "#95d67e",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug:false
      }
    },pixelArt: true,
  };

  const game = new Phaser.Game(config); // launch the game
  window.focus()
}
