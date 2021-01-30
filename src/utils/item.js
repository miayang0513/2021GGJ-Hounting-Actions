import Phaser from 'phaser'

export default class Item extends Phaser.GameObjects.Image {
  constructor (scene, id, place, config) {
    super(scene)
    scene.add.existing(this)
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.id = id
    this.place = place
    this.setTexture(this.id)

    // this.setInteractive()
    //   .on('pointerdown', () => {
    //     console.log(`物品: ${this.id}`)
    //   })

    if (this.place === 'ground') {
      this.placeItemOnGround(config)
    } else if (this.place === 'wall') {
      this.placeItemOnWall(config)
    }
  }
  placeItemOnGround ({ column, row, floor }) {
    const coordinateX = column - 1
    const coordinateY = row - 1
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    const tx = (coordinateX - coordinateY) * tileWidthHalf
    const ty = (coordinateX + coordinateY) * tileHeightHalf
    const x = this.centerX + tx
    const y = this.centerY + ty - (floor - 1) * tileHeight * 2
    const depth = this.centerY + ty

    const tile = this.scene.firstFloor.getChildren().find(tile => tile.coordinateX === coordinateX && tile.coordinateY === coordinateY)
    tile.item = this

    this.setDepth(depth)
    this.setPosition(x, y)
  }
  placeItemOnWall ({ depth, x, y }) {
    this.setDepth(depth)
    this.setPosition(x, y)
  }

}