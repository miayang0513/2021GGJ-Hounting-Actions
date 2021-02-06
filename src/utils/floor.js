import Phaser from 'phaser'
import EasyStar from 'easystarjs'
class Tile extends Phaser.GameObjects.Image {
  constructor (scene, { x, y, texture, depth, coordinateX, coordinateY, floor }) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.coordinateX = coordinateX
    this.coordinateY = coordinateY
    this.depth = depth
    this.floor = floor
    this.dot = scene.add.image(this.x, this.y - 100, 'dot').setDepth(this.depth).setVisible(false)
    this.borderRec = scene.add.image(this.x, this.y - 112, 'borderRec').setDepth(this.depth).setVisible(false)
    this._interactArea = new Phaser.Geom.Polygon([
      0, 101,
      96, 150, 192, 101,
      192, 89,
      96, 41,
      0, 89
    ])

    this.setInteractive(this._interactArea, Phaser.Geom.Polygon.Contains)
      .on('pointerdown', async () => {
        console.log(`${this.floor}樓 (${this.coordinateX}, ${this.coordinateY})`)

        if (this.floor === 1) {
          if (this.scene.firstFloor.lastClickTile === this) {
            console.log('move to')
          } else {
            const path = await this.scene.firstFloor.findPath(this)
          }
        }
      })
  }
  setDot () {
    this.dot.setVisible(true)
    this.borderRec.setVisible(false)
  }

  setBorderRec () {
    this.dot.setVisible(false)
    this.borderRec.setVisible(true)
  }

  clearIndicator () {
    this.dot.setVisible(false)
    this.borderRec.setVisible(false)
  }
}

export default class Floor extends Phaser.GameObjects.Group {
  constructor (scene, { column, row, floor }) {
    super(scene)
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.column = column
    this.row = row
    this.floor = floor
    this.lastClickTile = null
    this.lastPath = []
    this.easyStar = new EasyStar.js()
    this.placeTiles()
  }
  placeTiles () {
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    const easyGrid = []

    for (let y = 0; y < this.row; y++) {
      easyGrid.push([])
      for (let x = 0; x < this.column; x++) {
        easyGrid[y].push(0)
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
          tile.setTint(0X53788C)
          easyGrid[y][x] = 1
        }
        this.add(tile)
      }
    }
    this.easyStar.setGrid(easyGrid)
    this.easyStar.setAcceptableTiles([0])
  }
  findPath (targetTile) {
    this.clearLastPathHint()
    return new Promise((resolve, reject) => {
      this.lastClickTile = targetTile
      const character = this.scene.character
      this.easyStar.findPath(character.coordinateX, character.coordinateY, targetTile.coordinateX, targetTile.coordinateY, (path) => {
        if (path === null) {
          reject('Path not found')
        } else {
          for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i]
            const tile = this.getChildren().find(tile => tile.coordinateX === x && tile.coordinateY === y)
            if (i === path.length - 1 && (tile.hasOwnProperty('item') || tile.hasOwnProperty('monster'))) {
              continue
            } else {
              tile.setDot()
            }
            this.lastPath.push(tile)
          }
          this.lastPath[this.lastPath.length - 1].setBorderRec()
          resolve(this.lastPath)
        }
      })
    })
  }
  clearLastPathHint () {
    this.lastPath.forEach(path => path.clearIndicator())
    this.lastPath.length = 0
  }
}