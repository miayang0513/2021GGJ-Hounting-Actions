import Phaser from 'phaser'

export default class Tile extends Phaser.GameObjects.Image {
  constructor (scene, { x, y, texture, depth, coordinateX, coordinateY }) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.setDepth(depth)
    this.coordinateX = coordinateX
    this.coordinateY = coordinateY
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
        console.log('here', this.coordinateX, this.coordinateY, this.depth)
      })
  }
}