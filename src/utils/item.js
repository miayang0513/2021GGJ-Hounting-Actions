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
    this.coordinateX = null
    this.coordinateY = null

    if (this.place === 'ground') {
      this.placeItemOnGround(config)
    } else if (this.place === 'wall') {
      this.placeItemOnWall(config)
    }

    // indicator
    this.indicator = scene.add.image(this.x, this.y - this.height, 'itemIndicator').setOrigin(0.5, 1).setDepth(this.depth).setVisible(false)
    this.tween = this.scene.tweens.add({
      paused: true,
      targets: this.indicator,
      ease: 'Power2',
      y: '+=24',
      duration: 1000,
      repeat: -1,
      yoyo: true
    })
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

    if (floor === 1) {
      const tile = this.scene.firstFloor.getChildren().find(tile => tile.coordinateX === coordinateX && tile.coordinateY === coordinateY)
      tile.item = this
    } else {
      const tile = this.scene.secondFloor.getChildren().find(tile => tile.coordinateX === coordinateX && tile.coordinateY === coordinateY)
      tile.item = this
    }


    this.setDepth(depth)
    this.setPosition(x, y)
  }
  placeItemOnWall ({ depth, x, y, column = null, row = null, floor }) {
    this.setDepth(depth)
    this.setPosition(x, y)
    if (column !== null && row !== null) {
      this.coordinateX = column - 1
      this.coordinateY = row - 1
      if (floor === 1) {
        const tile = this.scene.firstFloor.getChildren().find(tile => tile.coordinateX === this.coordinateX && tile.coordinateY === this.coordinateY)
        tile.wall = this
      } else {
        const tile = this.scene.secondFloor.getChildren().find(tile => tile.coordinateX === this.coordinateX && tile.coordinateY === this.coordinateY)
        tile.wall = this
      }
      this.setInteractive()
        .on('pointerdown', () => {
          const tile = this.scene.currentFloor.getChildren().find(tile => tile.coordinateX === this.coordinateX && tile.coordinateY === this.coordinateY)
          tile.emit('pointerdown')
          console.log(`物品: ${this.id} and walk to ${this.coordinateX} ${this.coordinateY}`)
        })
    }
  }

  showIndicator (bool) {
    if (bool) {
      this.indicator.setVisible(true)
      this.tween.play()
    } else {
      this.indicator.setVisible(false)
      this.tween.pause()
    }
  }

}