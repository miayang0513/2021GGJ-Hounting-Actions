import Phaser from 'phaser'

export default class Wall extends Phaser.GameObjects.Image {
  constructor (scene, { x, y, texture, depth }) {
    super(scene, x, y, texture)
    scene.add.existing(this)

    this.setDepth(depth)
    this.setInteractive()
      .on('pointerdown', () => {
        console.log("I'm a wall")
      })
  }
}