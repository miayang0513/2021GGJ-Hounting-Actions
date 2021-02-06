import Phaser from 'phaser'
import store from '../store'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, { floor, coordinateX, coordinateY }) {
    super(scene)
    scene.add.existing(this)
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.setTexture('character')
    this.setOrigin(0.5, 1)
    this.coordinateX = coordinateX
    this.coordinateY = coordinateY
    this.floor = floor
    this.state = 'idle'
    this.direction = 'left_front'
    this.count = 0

    this.placeCharacterOnGround()

    this.generateAnim('left_back_idle', 'left_back', 0, 0, 0)
    this.generateAnim('left_back_walk', 'left_back', 1, 2, -1)
    this.generateAnim('left_front_idle', 'left_front', 0, 0, 0)
    this.generateAnim('left_front_walk', 'left_front', 1, 2, -1)
    this.generateAnim('right_back_idle', 'right_back', 0, 0, 0)
    this.generateAnim('right_back_walk', 'right_back', 1, 2, -1)
    this.generateAnim('right_front_idle', 'right_front', 0, 0, 0)
    this.generateAnim('right_front_walk', 'right_front', 1, 2, -1)
    this.generateAnim('umbrella', 'umbrella', 0, 1, 2)
    this.generateAnim('climb_walk', 'climb', 0, 2, -1)
    this.playAnim()
  }
  _move_path ({ tilePath, targetTile }) {
    if (this.scene.bigMonster.alpha === 0) {
      this.count++
      if (this.count === 3) {
        this.count = 0
        this.scene.bigMonster.walkBack()
      }
    }
    this.state = 'walk'
    store.dispatch('cancelItemJitter')
    var _tweens = []
    _tweens.length = tilePath.length
    for (let i = 0; i < tilePath.length; i++) {

      this.coordinateX = tilePath[i].coordinateX
      this.coordinateY = tilePath[i].coordinateY

      // 決定方位
      if (i !== tilePath.length - 1) {
        const nextX = tilePath[i + 1].coordinateX
        const nextY = tilePath[i + 1].coordinateY
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
        y: tilePath[i].y - this.height / 1.5,
        duration: 500,
        ease: 'Expo',
        easeParams: [],
        yoyo: false,
        onStart: (tween, targets, depth, character) => {
          character.depth = depth + 50
          if (i === tilePath.length - 1) {
            if (character.floor.floor === 2 && (targetTile.coordinateX === 7 || targetTile.coordinateY === 3)) {
              if (store.state.items.includes('umbrella')) {
                this.play('umbrella')
              }
            }
          }
        },
        onStartParams: [tilePath[i].depth, this],
        onComplete: (tween, targets, character) => {
          // audio
          this.scene.scene.get('AudioScene').walkAudio.play()

          console.log(`總共${tilePath.length}步，現在是第${i + 1}步`)
          store.dispatch('walk')
          if (i === tilePath.length - 1) {
            if (character.floor.floor === 2 && (targetTile.coordinateX === 7 || targetTile.coordinateY === 3)) {
              character.setFloor(this.scene.firstFloor, targetTile.coordinateX, targetTile.coordinateY, false)
              if (store.state.items.includes('umbrella')) {
                store.dispatch('useItem', { in: 'umbrella', out: 'safe' })
              } else {
                store.dispatch('gameOver')
              }
            }
            character.state = 'idle'
            this.playAnim()
            if (targetTile.hasOwnProperty('item')) {
              store.dispatch('makeItemJitter', targetTile.item.id)
            } else if (targetTile.objType === 'monster') {
              store.dispatch('makeItemJitter', targetTile.id)
            } else if (targetTile.hasOwnProperty('wall')) {
              store.dispatch('makeItemJitter', targetTile.wall.id)
            }

            this.floor.pathfinder.ClearPathHint()
          }
        },
        onCompleteParams: [this]
      }
    }
    this.playAnim()
    this.scene.tweens.timeline({ tweens: _tweens })
  }

  _move_bytile (tile, instant) {
    this._move(tile.x, tile.y, tile.depth, instant)
    this.coordinateX = tile.coordinateX
    this.coordinateY = tile.coordinateY
    this.depth = tile.depth + 20
  }

  _move (x, y, depth, instant) {
    var tX = x
    var tY = y - this.height / 1.5 //FIXME: 因為希望角色顯示在正中間所以硬幹
    this.depth = depth + 300 //FIXME: 因為希望角色顯示在最上面所以硬幹
    // TODO: 到二樓後 depth 變大

    if (instant) {
      this.x = tX
      this.y = tY
      return
    }

    this.state = 'walk'
    this.playAnim()

    this.tween = this.scene.tweens.add({
      targets: this,
      x: tX,
      y: tY,
      duration: 1000,
      ease: 'Expo',
      easeParams: [],
      yoyo: false,
      onComplete: (tween, targets, anims) => {
        this.state = 'idle'
        this.playAnim()
      },
      onCompleteParams: [this.anims]
    })
  }

  generateAnim (key, posName, startFrame, endFrame, repeat) {
    const config = {
      key: key,
      frames: this.scene.anims.generateFrameNames(this.texture.key, {
        prefix: posName + '_',
        suffix: '.png',
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 5,
      repeat: repeat
    }
    this.scene.anims.create(config)
  }

  playAnim () {
    this.play(`${this.direction}_${this.state}`)
  }
  readyToMove (floor, coordinateX, coordinateY) {

  }
  moveTo (floor, coordinateX, coordinateY) {

  }
  placeCharacterOnGround () {
    const coordinateX = this.coordinateX - 1
    const coordinateY = this.coordinateY - 1
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    const tx = (coordinateX - coordinateY) * tileWidthHalf
    const ty = (coordinateX + coordinateY) * tileHeightHalf
    const x = this.centerX + tx
    const y = this.centerY + ty - (this.floor - 1) * tileHeight * 2
    const depth = this.centerY + ty
    this.setPosition(x, y)
    this.setDepth(10000)
  }
}