import Player from "./player.js";
import Block from "./block.js";

export default class MainScene extends Phaser.Scene {
  preload() { // Loading function 

    // Getting user infos
    let match = document.cookie.match(new RegExp('(^| )infos=([^;]+)'));
    if (!match) window.location.replace("/menu");
    this.userConfig = JSON.parse(decodeURIComponent(match[2]))
    if (parseInt(this.userConfig.level) < 1) window.location.href = "/begining";
    if (parseInt(this.userConfig.level) > 14) window.location.href = "/end";

    // Loading tilesets
    this.load.image("main-tiles", "../../assets/tilesets/main.png");

    // Loading tilemaps
    this.load.tilemapTiledJSON("test", `../../assets/tilemaps/level${this.userConfig.level}.json`);

    // Loading spritesheets
    this.load.spritesheet(
      "player", 
      `../assets/spritesheets/c${this.userConfig.c}.png`,
      {frameWidth: 24, frameHeight: 24, margin: 0, spacing: 0}
    );

    // Loading entities 
    this.load.image("upwall", "../../assets/entities/upwall.png")
    this.load.image("downwall", "../../assets/entities/downwall.png")
    this.load.image("leftwall", "../../assets/entities/leftwall.png")
    this.load.image("rightwall", "../../assets/entities/rightwall.png")
    this.load.image("straightdoor", "../../assets/entities/straightdoor.png")

    // Loading blocks
    this.load.image("baseblock", "../../assets/blocks/base.png");
    this.load.image("valid_bridge", "../../assets/blocks/valid_bridge.png");
    this.load.image("unvalid_bridge", "../../assets/blocks/unvalid_bridge.png");
    this.load.image("unvalid_key", "../../assets/blocks/unvalid_key.png");
    this.load.image("valid_key", "../../assets/blocks/valid_key.png");
    this.load.image("unvalid_fastkey", "../../assets/blocks/unvalid_fastkey.png");
    this.load.image("valid_fastkey", "../../assets/blocks/valid_fastkey.png");
    this.load.image("unvalid_nearkey", "../../assets/blocks/unvalid_nearkey.png");
    this.load.image("valid_nearkey", "../../assets/blocks/valid_nearkey.png");
    this.load.image("unvalid_ifv", "../../assets/blocks/unvalid_ifv.png");
    this.load.image("valid_ifv", "../../assets/blocks/valid_ifv.png");
    this.load.image("unvalid_ifh", "../../assets/blocks/unvalid_ifh.png");
    this.load.image("valid_ifh", "../../assets/blocks/valid_ifh.png");
    this.load.image("unvalid_wall", "../../assets/blocks/unvalid_wall.png");
    this.load.image("valid_wall", "../../assets/blocks/valid_wall.png");
    this.load.image("valid_door", "../../assets/blocks/valid_door.png");
    this.load.image("unvalid_door", "../../assets/blocks/unvalid_door.png");
    this.load.image("valid_right", "../../assets/blocks/valid_right.png");
    this.load.image("unvalid_repeatkey", "../../assets/blocks/unvalid_repeatkey.png");
    this.load.image("valid_repeatkey", "../../assets/blocks/valid_repeatkey.png");
    this.load.image("unvalid_right", "../../assets/blocks/unvalid_right.png");
    this.load.image("valid_left", "../../assets/blocks/valid_left.png");
    this.load.image("unvalid_left", "../../assets/blocks/unvalid_left.png");
    this.load.image("valid_up", "../../assets/blocks/valid_up.png");
    this.load.image("unvalid_up", "../../assets/blocks/unvalid_up.png");
    this.load.image("valid_down", "../../assets/blocks/valid_down.png");
    this.load.image("unvalid_down", "../../assets/blocks/unvalid_down.png");
  }

  create() { // Create function

    // Creating the map
    const map = this.make.tilemap({ key: "test" });
    const tileset = map.addTilesetImage("main", "main-tiles");
    this.bottomLayer = map.createStaticLayer("bottom", tileset, 0, 0);
    this.middleLayer = map.createStaticLayer("middle", tileset, 0, 0);
    this.topLayer = map.createStaticLayer("top", tileset, 0, 0);
    this.middleLayer.setCollisionByProperty({ collides: true });
    this.topLayer.setDepth(10);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // Creating the player
    const spawn = map.findObject("points", obj => obj.name === "spawn");
    this.player = new Player(this, spawn.x, spawn.y)

    // Creating the endpoint
    this.ending = false;
    const end = map.findObject("points", obj => obj.name === "end");
    this.endpoint = this.physics.add.sprite(end.x +end.width/2, end.y + end.height/2).setSize(end.width, end.height);
    this.endingcheck = this.physics.add.overlap(this.player.sprite, this.endpoint, this.playerWin, null, this);

    // Declaring some variables
    this.blocks = [];
    this.walls = [];
    this.doors = [];
    this.repeatcooldown = false;

    // Adding entities
    map.getObjectLayer("entities").objects.forEach(object => {

      if (object.name.startsWith("text")) { // Creating texts
        let text = object.properties.find(p => p.name == "text").value;
        this.add.text(object.x, object.y, text, {
          color:'#FFFFFF',
          fontFamily:"monospace",
          fontSize:"12px",
          padding: { x: 8, y: 4 },
          backgroundColor: "#000000"
        }).setDepth(1);

      } else if (object.name.startsWith("static")) { // Creating static texts
        let text = object.properties.find(p => p.name == "text").value;
        this.add.text(object.x, object.y, text, {
          color:'#FFFFFF',
          fontFamily:"monospace",
          fontSize:"12px",
          padding: { x: 8, y: 4 },
          backgroundColor: "#000000"
        }).setDepth(10).setScrollFactor(0);

      } else if (object.name.startsWith("block")) { // Creating Blocks
        let block = new Block(this, object.x, object.y, object.properties.find(p => p.name == "value").value);
        this.blocks.push(block);

      } else if (object.name.startsWith("wall")) { // Creating walls
        let direction = object.properties.find(p => p.name == "direction").value;
        let height, width, texture;
        if (direction == "up") {
          width = Math.floor(object.width / 16) * 16
          height = 16;
          texture = "upwall";
        } if (direction == "down") {
          width = Math.floor(object.width / 16) * 16
          height = 16;
          texture = "downwall";
        } if (direction == "left") {
          height = Math.floor(object.height / 16) * 16
          width = 16;
          texture = "leftwall";
        } if (direction == "right") {
          height = Math.floor(object.height / 16) * 16;
          width = 16;
          texture = "rightwall";
        }
        let wall = this.add.tileSprite(object.x + object.width/2, object.y + object.height/2, width, height, texture);
        wall = this.physics.add.existing(wall)
        wall.body.immovable = true;
        this.physics.add.collider(this.player.sprite, wall);
        this.walls.push(wall);

      } else if (object.name.startsWith("door")) { // Creating doors
        let door = this.physics.add.sprite(object.x + object.width/2, object.y + object.height/2, "straightdoor");
        door.body.immovable = true;
        door.open = object.properties.find(p => p.name == "open").value;
        this.physics.add.collider(this.player.sprite, door);
        if (door.open) door.disableBody(true, true); 
        this.doors.push(door);
      }
    })

    // Setting up the camera
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(1.5);
    this.cameras.main.startFollow(this.player.sprite);
  }

  update(time, delta) {
    // Looped function

    // Fast repeat blocks
    this.blocks.forEach((block) => {
        if (block.value != "fastkey") return;
        let chains = [];
        if (block.touching.down) {
          let chain = [];
          let blocky = block.touching.down;
          while (blocky) {
            chain.push(blocky.environement);
            blocky = blocky.environement.touching.down;
          }
          chains.push(chain)
        };
        if (block.touching.right) {
          let chain = []
          let blocky = block.touching.right;
          while (blocky) {
            chain.push(blocky.environement);
            blocky = blocky.environement.touching.right;
          }
          chains.push(chain);
        };
        chains.forEach((chain) => {
          let condition = false;
          chain.forEach((block) => {
            if (condition == true) return;
            if (block.value == "wall") {this.walls.forEach((wall) => {wall.destroy()})}
            else if (block.value == "door") {this.doors.forEach( (door)=> {
              if (!door.open) {
                door.disableBody(true, true); 
                door.open = true;
              } else {
                door.enableBody(true, door.x, door.y, true, true); 
                door.open = false;
              }
            })}
            else if (block.value == "ifh") {if (block.sprite.x < this.player.sprite.x) condition = true}
            else if (block.value == "ifv") {if (block.sprite.y < this.player.sprite.y) condition = true};
          });
        });
      });

    // Repeat blocks 
    if (!this.repeatcooldown) {
      this.repeatcooldown = true;
      setTimeout(() => {this.repeatcooldown = false}, 1000);
      this.blocks.forEach((block) => {
        if (block.value != "repeatkey") return;
        let chains = [];
        if (block.touching.down) {
          let chain = [];
          let blocky = block.touching.down;
          while (blocky) {
            chain.push(blocky.environement);
            blocky = blocky.environement.touching.down;
          }
          chains.push(chain)
        };
        if (block.touching.right) {
          let chain = []
          let blocky = block.touching.right;
          while (blocky) {
            chain.push(blocky.environement);
            blocky = blocky.environement.touching.right;
          }
          chains.push(chain);
        };
        chains.forEach((chain) => {
          let condition = false;
          chain.forEach((block) => {
            if (condition == true) return;
            if (block.value == "wall") {this.walls.forEach((wall) => {wall.destroy()})}
            else if (block.value == "door") {this.doors.forEach( (door)=> {
              if (!door.open) {
                door.disableBody(true, true); 
                door.open = true;
              } else {
                door.enableBody(true, door.x, door.y, true, true); 
                door.open = false;
              }
            })}
            else if (block.value == "ifh") {if (block.sprite.x < this.player.sprite.x) condition = true}
            else if (block.value == "ifv") {if (block.sprite.y < this.player.sprite.y) condition = true};
          });
        });
      });
    }
  }

  playerWin() {
    // When the player enter the finish zone
    if (this.ending) return;
    this.ending = true;
    this.endingcheck.destroy();
    this.cameras.main.fade(1000, 0, 0, 0);
    this.userConfig.level = parseInt(this.userConfig.level) + 1;
    document.cookie = `infos=${encodeURIComponent(JSON.stringify(this.userConfig))};path=/`;
    this.cameras.main.once("camerafadeoutcomplete", () => {window.location.href = '/game'});
  }
}