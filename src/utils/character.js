import Phaser from 'phaser'

export default class Character extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, texture, frame, options) {

    super(scene, x, y, texture, frame)

    scene.add.existing(this)

    this.HP = options.HP; //HP
    this.coordinateX = 0
    this.coordinateY = 0

    this.InitAnimConfig(texture)
    this.CharacterEvent = new Phaser.Events.EventEmitter();
    this.CharacterEvent.on('moveCharacter', this._move, this);
    this.CharacterEvent.on('moveCharacter_bytile', this._move_bytile, this);
    this.CharacterEvent.on('moveCharacter_bypath', this._move_path, this);

    this.setInteractive(this._interactArea, Phaser.Geom.Polygon.Contains)
      .on('pointerdown', () => {
        console.log('CharacterHp:' + this.HP)
      })
  }

  _move_path(tile = []) {

    var _tweens = []
    _tweens.length = tile.length
    for (let i = 0; i < tile.length; i++) {
      const element = tile[i];
      this._move_bytile(element, false);
      //
      _tweens[i] =
      {
        targets: this,
        x: tile[i].x,
        y: tile[i].y - 100,//FIXME: 因為希望角色顯示在正中間所以硬幹
        duration: 500,
        ease: 'Expo',
        easeParams: [],
        yoyo: false,
        onComplete: function (tween, targets, anims) { },
        onCompleteParams: [this.anims]
      }
      //
      if (i == tile.length - 1) {
        _tweens[i].onComplete = function (tween, targets, anims) { anims.play('idle') }
      }
    }

    this.anims.play('walk')
    var timeline = this.scene.tweens.timeline({
      tweens: _tweens,
    })
    this.TakeAction(tile.length)
  }

  _move_bytile(tile, instant) {
    this._move(tile.x, tile.y, tile.depth, instant)
    this.coordinateX = tile.coordinateX
    this.coordinateY = tile.coordinateY
  }

  _move(x, y, depth, instant) {
    var tX = x
    var tY = y - 100 //FIXME: 因為希望角色顯示在正中間所以硬幹
    this.depth = depth +300 //FIXME: 因為希望角色顯示在最上面所以硬幹

    if (instant) {
      this.x = tX
      this.y = tY
      return
    }

    this.anims.play('walk')
    this.tween = this.scene.tweens.add({
      targets: this,
      x: tX,
      y: tY,
      duration: 1000,
      ease: 'Expo',
      easeParams: [],
      yoyo: false,
      onComplete: function (tween, targets, anims) { anims.play('idle') },
      onCompleteParams: [this.anims]
    })
    this.TakeAction()
  }

  TakeAction(steps) {
    if (this.HP > 0) {
      this.HP -= steps
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