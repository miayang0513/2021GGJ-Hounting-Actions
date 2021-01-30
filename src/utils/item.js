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
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    const tx = ((column - 1) - (row - 1)) * tileWidthHalf
    const ty = ((column - 1) + (row - 1)) * tileHeightHalf
    const x = this.centerX + tx
    const y = this.centerY + ty - (this.height / 2) - tileHeight / 2 - (floor - 1) * tileHeight * 2
    const depth = this.centerY + ty

    this.setDepth(depth)
    this.setPosition(x, y)
  }
  placeItemOnWall ({ depth, x, y }) {
    this.setDepth(depth)
    this.setPosition(x, y)
  }

}