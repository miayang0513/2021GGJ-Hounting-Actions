import Phaser from 'phaser'

export default class Character extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame,options) {

    super(scene, x, y, texture, frame)

    scene.add.existing(this)

    this.HP = options.HP; //HP

    this.InitAnimConfig(texture)
    this.CharacterEvent = new Phaser.Events.EventEmitter();
    this.CharacterEvent.on('moveCharacter', this._move, this);
    this.CharacterEvent.on('moveCharacter_bytile', this._move_bytile, this);

    this.setInteractive(this._interactArea, Phaser.Geom.Polygon.Contains)
      .on('pointerdown', () => {
        console.log('CharacterHp:' + this.HP)
      })
  }

  _move_bytile(tile, instant) {
    this._move(tile.x, tile.y, tile.depth,instant)
  }

  _move(x, y, depth, instant) {
    this.TakeAction()
    this.anims.play('walk')
    var tX = x
    var tY = y - 100 //FIXME: 因為希望角色顯示在正中間所以硬幹
    this.depth = depth + 100000 //FIXME: 因為希望角色顯示在最上面所以硬幹
    if(instant){
      this.x = tX
      this.y = tY
      return
    }
    this.tween = this.scene.tweens.add({
      targets: this,
      x: tX,
      y: tY,
      duration: 1000,
      ease: 'Expo',
      easeParams: [],
      yoyo: false,
    });

  }

  TakeAction() {
    if (this.HP > 0) {
      this.HP -= 1
    }
    else {
      this.HP = 0
      //TODO: Call GameOver
    }
  }

  InitAnimConfig(an_init_texture) {
    const anim_walk = {
      key: 'walk',
      frames: an_init_texture,
      frameRate: 10,
      repeat: -1
    };
    const anim_idle = {
      key: 'idle',
      frames: an_init_texture,
      frameRate: 0,
      repeat: -1
    };
    this.anims.create(anim_idle)
    this.anims.create(anim_walk)
    this.anims.play('idle')
  }
}