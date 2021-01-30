import Phaser from 'phaser'
import store from '../store'

export default class Character extends Phaser.GameObjects.Sprite {

<<<<<<< HEAD
  constructor (scene, x, y, texture, options) {
=======
  constructor(scene, x, y, texture, frame, options) {
>>>>>>> 23edef7 (feat: can fall from sec. floor)

    super(scene, x, y, texture,)

    scene.add.existing(this)

    this.coordinateX = 0
    this.coordinateY = 0
    this.state = 'idle'
<<<<<<< HEAD
    this.direction = 'left_front'
    this.floor = null //用來處理
    this.setOrigin(0.5, 1)

    this.generateAnim('left_back_idle', 'left_back', 0, 0, 0)
    this.generateAnim('left_back_walk', 'left_back', 1, 2, -1)
    this.generateAnim('left_front_idle', 'left_front', 0, 0, 0)
    this.generateAnim('left_front_walk', 'left_front', 1, 2, -1)
    this.generateAnim('right_back_idle', 'right_back', 0, 0, 0)
    this.generateAnim('right_back_walk', 'right_back', 1, 2, -1)
    this.generateAnim('right_front_idle', 'right_front', 0, 0, 0)
    this.generateAnim('right_front_walk', 'right_front', 1, 2, -1)
    // this.generateAnim('umbrella_walk', 'umbrella', 1, 2, -1)
    this.generateAnim('climb_walk', 'climb', 0, 2 , -1)
    this.play(`${this.direction}_${this.state}`)
=======
    this.floor = null

    this.tileEvent = [{ x: 0, y: 0, floor: null, callback: () => { } }]
>>>>>>> 23edef7 (feat: can fall from sec. floor)

    this.CharacterEvent = new Phaser.Events.EventEmitter()
    this.CharacterEvent.on('moveCharacter_bytile', this._move_bytile, this)
    this.CharacterEvent.on('moveCharacter_bypath', this._move_path, this)
  }

<<<<<<< HEAD
  setFloor (Floor, Index, instant = false) {
    if (this.floor) this.floor.pathfinder.ClearPathHint()
=======
  traverse_event() {
    //FIXME: 不管怎樣都會呼叫
    for (let i = 0; i < this.tileEvent.length; i++) {
      const element = this.tileEvent[i];
      if (this.coordinateX == element.x &&
          this.coordinateY == element.y &&
          this.floor == element.floor)
           { element.callback() }
    }

  }

  setFloor(Floor, Index, instant = false) {
    if (this.floor) {
      this.floor.pathfinder.ClearPathHint()
      this.floor.setInteractable(false)
    }
>>>>>>> 23edef7 (feat: can fall from sec. floor)
    this.floor = Floor
    this.floor.setInteractable(true)

    this._move_bytile(this.floor.getChildren()[Index], instant)
    this.floor.pathfinder.ClearPathHint()
  }

<<<<<<< HEAD
  _move_path ({ tilePath, targetTile }) {
    this.state = 'walk'
=======

  _move_path({ tilePath, targetTile }) {
    this.state = 'walking'
>>>>>>> 23edef7 (feat: can fall from sec. floor)
    store.dispatch('cancelItemJitter')
    var _tweens = []
    _tweens.length = tilePath.length
    for (let i = 0; i < tilePath.length; i++) {

      this.coordinateX = tilePath[i].coordinateX
      this.coordinateY = tilePath[i].coordinateY

      // 決定方位
      if (i !== tilePath.length-1) {
        const nextX = tilePath[i+1].coordinateX
        const nextY = tilePath[i+1].coordinateY
        if (nextX < this.coordinateX && nextY === this.coordinateY) { // 左上
          this.direction = 'left_back'
        } else if (nextX > this.coordinateX && nextY === this.coordinateY) { // 右下
          this.direction = 'right_front'
        } else if (nextX === this.coordinateX && nextY < this.coordinateY) { // 右上
          this.direction = 'right_back'
        } else {
          this.direction = 'left_front'
        }
      }

      _tweens[i] =
      {
        targets: this,
        x: tilePath[i].x,
        y: tilePath[i].y - this.height/1.5,
        duration: 500,
        ease: 'Expo',
        easeParams: [],
        yoyo: false,
        onStart: function (tween, targets, depth, character) { character.depth = depth + 50 },
        onStartParams: [tilePath[i].depth, this],
        onComplete: (tween, targets, character) => {
          // console.log(`總共${tilePath.length}步，現在是第${i + 1}步`)
          store.dispatch('walk')
          if (i === tilePath.length - 1) {
            character.state = 'idle'
            this.play(`${this.direction}_${this.state}`)
            if (targetTile.hasOwnProperty('item')) {
              store.dispatch('makeItemJitter', targetTile.item.id)
            }

            this.floor.pathfinder.ClearPathHint()
          }
          this.traverse_event()
        },
        onCompleteParams: [this]
      }
<<<<<<< HEAD
=======

>>>>>>> 23edef7 (feat: can fall from sec. floor)
    }
    this.play(`${this.direction}_${this.state}`)
    this.scene.tweens.timeline({ tweens: _tweens })
  }

  _move_bytile(tile, instant) {
    this._move(tile.x, tile.y, tile.depth, instant)
    this.coordinateX = tile.coordinateX
    this.coordinateY = tile.coordinateY
    this.depth = tile.depth + 20
  }

  _move(x, y, depth, instant) {
    var tX = x
    var tY = y - this.height/1.5 //FIXME: 因為希望角色顯示在正中間所以硬幹
    this.depth = depth + 300 //FIXME: 因為希望角色顯示在最上面所以硬幹
    // TODO: 到二樓後 depth 變大

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
  }

<<<<<<< HEAD
  generateAnim (key, posName, startFrame, endFrame, repeat) {
    const config = {
      key: key,
      frames: this.scene.anims.generateFrameNames(this.texture.key, {
        prefix: posName+ '_',
        suffix: '.png',
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 5,
      repeat: repeat
=======
  InitAnimConfig(an_init_texture) {
    const anim_walk = {
      key: 'walk',
      frames: an_init_texture,
      frameRate: 10,
      repeat: -1
    }
    const anim_idle = {
      key: 'idle',
      frames: an_init_texture,
      frameRate: 0,
      repeat: -1
>>>>>>> 23edef7 (feat: can fall from sec. floor)
    }
    this.scene.anims.create(config)
  }

}