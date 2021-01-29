import Phaser from 'phaser'

export default class Tile extends Phaser.GameObjects.Image {
  constructor (scene, x, y, texture, options, frame) {
    super(scene, x, y, texture, frame)
    scene.add.existing(this)

    this.coordinateX = options.coordinateX
    this.coordinateY = options.coordinateY
    this.depth = options.depth
    this._interactArea = new Phaser.Geom.Polygon([
      0, 101,
      96, 150,
      192, 101,
      192, 89,
      96, 41,
      0, 89
    ])
    this.setInteractive(this._interactArea, Phaser.Geom.Polygon.Contains)
      .on('pointerdown', () => {
        console.log('here', this.coordinateX, this.coordinateY)
      })
  }
}