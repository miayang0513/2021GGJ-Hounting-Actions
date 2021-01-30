import Phaser from 'phaser'

class Tile extends Phaser.GameObjects.Image {
  constructor (scene, { x, y, texture, depth, coordinateX, coordinateY, floor }) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.setDepth(depth)
    this.floor = floor
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
        console.log(`${this.floor}樓 (${this.coordinateX}, ${this.coordinateY})`)
      })
  }
}

export default class Floor extends Phaser.GameObjects.Group {
  constructor (scene, { column, row, floor }) {
    super(scene)
    this.scene = scene
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.column = column
    this.row = row
    this.floor = floor
    this.placeTiles()
  }
  placeTiles () {
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2

    for (let y = 0; y < this.row; y++) {
      for (let x = 0; x < this.column; x++) {
        let tx = (x - y) * tileWidthHalf
        let ty = (x + y) * tileHeightHalf
        const options = {
          x: this.centerX + tx,
          y: this.centerY + ty - (this.floor - 1) * tileHeight * 2,
          texture: (x + y) % 2 === 0 ? 'tile-light' : 'tile-dark',
          depth: this.centerY + ty,
          coordinateX: x,
          coordinateY: y,
          floor: this.floor
        }
        const tile = new Tile(this.scene, options).setOrigin(0.5, 1)
        if (x < 7 && y < 3 && this.floor === 1) {
          tile.setTint(0X1F3B4A)
        }
        this.add(tile)
      }
    }
  }
}