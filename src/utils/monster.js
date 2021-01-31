import Phaser from 'phaser'

export default class Monster extends Phaser.GameObjects.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y)
    scene.add.existing(this)

    this.originPos = { x: x, y: y }
    this.id = 'big-monster'

    this.setTexture('big-monster').setFrame('big_idle.png').setDepth(this.y + 120)
    this.generateAnim('big_walk', 'big_walk', 0, 1, -1)
    this.generateAnim('big_back', 'big_back', 0, 1, -1)

    const tile = this.scene.firstFloor.getChildren().find(tile => tile.coordinateX === 8 && tile.coordinateY === 0)
    tile.monster = this
  }

  walkToDrinkBeer () {
    this.setFrame('big_beer.png')
    setTimeout(() => {
      this.play('big_walk')
      this.scene.add.tween({
        targets: this,
        x: '-=160',
        y: '-=80',
        alpha: 0,
        duration: 1000,
      })
    }, 500)
  }

  walkBack () {
    setTimeout(() => {
      this.play('big_back')
      this.scene.add.tween({
        targets: this,
        x: '+=160',
        y: '+=80',
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          this.stop()
          this.setFrame('big_idle.png')
        }
      })
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

}
