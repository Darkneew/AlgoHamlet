export default class Block {
  constructor(scene, x, y, value) { // Constructor
    
    // Setting variables and subscribing to events
    this.scene = scene;
    this.moving = false;
    this.pushed;
    this.value = value;
    this.scene.events.on("update", this.update, this);
    this.touching = {
      left: undefined,
      right: undefined,
      up: undefined,
      down: undefined,
      is: false
    }

    // Making the actual block
    this.sprite = this.scene.physics.add.sprite(x, y, "baseblock").setSize(24, 18).setOffset(0,13).setDepth(1).setDrag(2000);
    this.sprite.environement = this;
    this.top = this.scene.physics.add.sprite(x, y-8, `unvalid_${this.value}`).setDepth(2);
    this.up_sensor = this.scene.physics.add.sprite(x, y-4).setDepth(1).setSize(24,4);
    this.down_sensor = this.scene.physics.add.sprite(x, y+17).setDepth(1).setSize(24,4);
    this.right_sensor = this.scene.physics.add.sprite(x+12, y+4).setDepth(1).setSize(4,18);
    this.left_sensor = this.scene.physics.add.sprite(x-12, y+4).setDepth(1).setSize(4,18);
    this.up_sensor.environement = this;
    this.down_sensor.environement = this;
    this.left_sensor.environement = this;
    this.right_sensor.environement = this;

    // Defining its collisions
    this.scene.physics.add.collider(this.sprite, this.scene.middleLayer);
    this.sprite.setCollideWorldBounds(true);
    this.scene.physics.add.collider(this.sprite, this.scene.player.sprite)
    this.scene.blocks.forEach((block) => {
      this.scene.physics.add.collider(this.sprite, block.sprite);
      this.scene.physics.add.collider(this.down_sensor, block.up_sensor, this.downSensing, null, this.scene);
      this.scene.physics.add.collider(this.up_sensor, block.down_sensor, this.upSensing, null, this.scene);
      this.scene.physics.add.collider(this.left_sensor, block.right_sensor, this.leftSensing, null, this.scene);
      this.scene.physics.add.collider(this.right_sensor, block.left_sensor, this.rightSensing, null, this.scene);
    })
  }

  downSensing (b1, b2) {
    b1.environement.touching.down = b2;
    b2.environement.touching.up = b1;
    b1.environement.touching.is = true;
    b1.environement.top.setTexture(`valid_${b1.environement.value}`);
    b2.environement.touching.is = true;
    b2.environement.top.setTexture(`valid_${b2.environement.value}`);
  }

  upSensing (b1, b2) {
    b1.environement.touching.up = b2;
    b2.environement.touching.down = b1;
    b1.environement.touching.is = true;
    b1.environement.top.setTexture(`valid_${b1.environement.value}`);
    b2.environement.touching.is = true;
    b2.environement.top.setTexture(`valid_${b2.environement.value}`);
  }
  
  leftSensing (b1, b2) {
    b1.environement.touching.left = b2;
    b2.environement.touching.right = b1;
    b1.environement.touching.is = true;
    b1.environement.top.setTexture(`valid_${b1.environement.value}`);
    b2.environement.touching.is = true;
    b2.environement.top.setTexture(`valid_${b2.environement.value}`);
  }
  
  rightSensing (b1, b2) {
    b1.environement.touching.right = b2;
    b2.environement.touching.left = b1;
    b1.environement.touching.is = true;
    b1.environement.top.setTexture(`valid_${b1.environement.value}`);
    b2.environement.touching.is = true;
    b2.environement.top.setTexture(`valid_${b2.environement.value}`);
  }

  update (time, delta) {
    // Moving the other bodies
    this.top.x = this.sprite.x;
    this.top.y = this.sprite.y-7;
    this.up_sensor.x = this.sprite.x;
    this.up_sensor.y = this.sprite.y-4;
    this.right_sensor.x = this.sprite.x+12;
    this.right_sensor.y = this.sprite.y+4;
    this.down_sensor.x = this.sprite.x;
    this.down_sensor.y = this.sprite.y+17;
    this.left_sensor.x = this.sprite.x-12;
    this.left_sensor.y = this.sprite.y+4;

    // Checking if still touching
    if (this.touching.down && !this.down_sensor.body.embedded) this.touching.down = undefined;
    if (this.touching.up && !this.up_sensor.body.embedded) this.touching.up = undefined;
    if (this.touching.left && !this.left_sensor.body.embedded) this.touching.left = undefined;
    if (this.touching.right && !this.right_sensor.body.embedded) this.touching.right = undefined;

    // Change texture
    if (this.touching.is && !this.touching.right && !this.touching.left && !this.touching.down && !this.touching.up) {
      this.touching.is = false;
      this.top.setTexture(`unvalid_${this.value}`);
    }
  }
}