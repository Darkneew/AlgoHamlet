export default class Player {
  constructor(scene, x, y) { // Constructor
    
    // Setting variables and inputs
    this.scene = scene;
    this.clicked = false;
    this.cursors = scene.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
      space: 'space'
    })
    
    // Listening to scene events
    this.scene.events.on("update", this.update, this);
    
    // Creating the actual sprite
    this.sprite = this.scene.physics.add.sprite(x, y, "player", 1).setSize(16, 9).setOffset(4,15).setDepth(2);
    this.scene.physics.add.collider(this.sprite, this.scene.middleLayer);
    this.sprite.setCollideWorldBounds(true);

    // Making animations
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNames("player", {start: 3, end: 5}),
      frameRate: 9,
      repeat: -1
    });
    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNames("player", {start: 6, end: 8}),
      frameRate: 9,
      repeat: -1
    });
    this.scene.anims.create({
      key: "up",
      frames: this.scene.anims.generateFrameNames("player", {start: 9, end: 11}),
      frameRate: 9,
      repeat: -1
    });
    this.scene.anims.create({
      key: "down",
      frames: this.scene.anims.generateFrameNames("player", {start: 0, end: 2}),
      frameRate: 9,
      repeat: -1
    });

  }

  update (time, delta) { // Looped function

    // Movement
    const speed = 130 * delta / 16;
    const prevVelocity = this.sprite.body.velocity.clone();
    this.sprite.body.setVelocity(0);
    if (this.cursors.left.isDown) {
      this.sprite.body.setVelocityX(-1);
    } else if (this.cursors.right.isDown) {
      this.sprite.body.setVelocityX(1);
    }
    if (this.cursors.up.isDown) {
      this.sprite.body.setVelocityY(-1);
    } else if (this.cursors.down.isDown) {
      this.sprite.body.setVelocityY(1);
    }
    this.sprite.body.velocity.normalize().scale(speed);

    // Animations
    if (this.cursors.left.isDown) {
      this.sprite.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.sprite.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.sprite.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.sprite.anims.play("down", true);
    } else {
      this.sprite.anims.stop();
      if (prevVelocity.x < 0) this.sprite.setTexture("player", 4);
      else if (prevVelocity.x > 0) this.sprite.setTexture("player", 7);
      else if (prevVelocity.y < 0) this.sprite.setTexture("player", 10);
      else if (prevVelocity.y > 0) this.sprite.setTexture("player", 1);
    }

    // Block actions
    if (this.cursors.space.isDown && !this.clicked) {
      this.clicked = true;
      this.scene.blocks.forEach((block) => {
        if (!((block.value == "nearkey" &&  Phaser.Math.Distance.BetweenPoints(block.sprite, this.sprite) < 30)|| block.value == "key")) return;
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
            if (block.value == "wall") {this.scene.walls.forEach((wall) => {wall.destroy()})}
            else if (block.value == "door") {this.scene.doors.forEach( (door)=> {
              if (!door.open) {
                door.disableBody(true, true); 
                door.open = true;
              } else {
                door.enableBody(true, door.x, door.y, true, true); 
                door.open = false;
              }
            })}
            else if (block.value == "ifh") {if (block.sprite.x < this.sprite.x) condition = true}
            else if (block.value == "ifv") {if (block.sprite.y < this.sprite.y) condition = true};
          });
        });
      });
    }
    if (this.cursors.space.isUp && this.clicked) this.clicked = false;
    
  }
} 