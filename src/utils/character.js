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
  moveTo (tilePath, targetTile) {
    if (this.scene.bigMonster.alpha === 0) {
      this.count++
      if (this.count === 3) {
        this.count = 0
        this.scene.bigMonster.walkBack()
      }
    }
    store.dispatch('cancelItemJitter')
    this.state = 'walk'
    const tweens = []
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

      tweens.push({
        targets: this,
        x: tilePath[i].x,
        y: tilePath[i].y - this.height / 1.5,
        duration: 500,
        ease: 'Expo',
        onStartParams: [tilePath[i].depth],
        onStart: (tween, targets, depth) => {
          this.depth = depth + 50
          if (this.floor === 2 && (tilePath[i].coordinateX === 7 || tilePath[i].coordinateY === 3)) {
            if (store.state.items.includes('umbrella')) {
              this.play('umbrella')
            }
          }
        },
        onCompleteParams: [store.state.items.includes('umbrella')],
        onComplete: (tween, targets, haveUmbrella) => {
          console.log(`總共${tilePath.length}步，現在是第${i + 1}步`)

          // audio
          this.scene.scene.get('AudioScene').walkAudio.play()
          store.dispatch('walk')
          if (this.floor === 2 && (tilePath[i].coordinateX === 7 || tilePath[i].coordinateY === 3)) {
            if (!haveUmbrella) {
              return store.dispatch('gameOver')
            }
            if (haveUmbrella && store.state.items.includes('umbrella')) {
              store.dispatch('useItem', { in: 'umbrella', out: 'safe' })
            }
          }
          if (i === tilePath.length - 1) {
            this.state = 'idle'
            this.playAnim()
            if (targetTile.hasOwnProperty('item')) {
              store.dispatch('makeItemJitter', targetTile.item.id)
            } else if (targetTile.hasOwnProperty('monster')) {
              store.dispatch('makeItemJitter', targetTile.monster.id)
            } else if (targetTile.hasOwnProperty('wall')) {
              store.dispatch('makeItemJitter', targetTile.wall.id)
            }
            this.scene.currentFloor.clearLastPathHint()
            if (this.floor === 2) {
              this.scene.switchFloor()
            }
          }
        }
      })

    }
    this.playAnim()
    this.scene.tweens.timeline({ tweens })
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

  climb () {
    this.scene.nail.setTexture('rope')
    this.scene.tweens.add({
      targets: this.scene.nail,
      alpha: 0,
      delay: 500,
      duration: 2000,
    })
    this.scene.switchFloor()
    const tile = this.scene.secondFloor.getChildren().find(tile => tile.coordinateX === 5 && tile.coordinateY === 2)
    this.coordinateX = tile.coordinateX
    this.coordinateY = tile.coordinateY
    const { x, y } = this.countPhaserXnY(this.coordinateX - 1, this.coordinateY - 1, 2)
    this.depth = tile.depth + 300
    this.state = 'walk'
    this.playAnim()
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: 1000,
      ease: 'Expo',
      onComplete: (tween, targets) => {
        this.state = 'idle'
        this.playAnim()
      }
    })
  }
  playAnim () {
    this.play(`${this.direction}_${this.state}`)
  }
  placeCharacterOnGround () {
    const { x, y } = this.countPhaserXnY(this.coordinateX - 1, this.coordinateY - 1, this.floor)
    this.setPosition(x, y)
    this.setDepth(10000)
  }
  countPhaserXnY (coordinateX, coordinateY, floor) {
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    const tx = (coordinateX - coordinateY) * tileWidthHalf
    const ty = (coordinateX + coordinateY) * tileHeightHalf
    const x = this.centerX + tx
    const y = this.centerY + ty - (floor - 1) * tileHeight * 2
    return { x, y }
  }
}