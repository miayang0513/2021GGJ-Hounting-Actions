import Phaser from 'phaser'
import PathFinding from './pathfinding'
class Tile extends Phaser.GameObjects.Image {
  constructor (scene, { x, y, texture, depth, coordinateX, coordinateY, floor, acceptable, playerevents, pathfinder }) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.pathselecting = false
    this.coordinateX = coordinateX
    this.coordinateY = coordinateY
    this.depth = depth
    this.floor = floor
    this.acceptable = acceptable
    this.playerevents = playerevents
    this.pathfinder = pathfinder
    this._interactArea = new Phaser.Geom.Polygon([
      0, 101,
      96, 150, 192, 101,
      192, 89,
      96, 41,
      0, 89
    ])
    this.setInteractive(this._interactArea, Phaser.Geom.Polygon.Contains)
      .on('pointerdown', () => {
        console.log(`${this.floor}樓 (${this.coordinateX}, ${this.coordinateY})`)
        this.CheckPosition()
      })

    this.dot = scene.add.image(this.x, this.y - 100, 'dot').setDepth(this.depth).setVisible(false)
    this.borderRec = scene.add.image(this.x, this.y - 112, 'borderRec').setDepth(this.depth).setVisible(false)
  }

  CheckPosition (playerevents = this.playerevents) {
    if (this.pathselecting == false) {
      this.pathselecting = true
      this.pathfinder.Find(this, function () { })
      return
    }
    else {
      this.pathfinder.Find(this, (tilePath) => {
        playerevents.emit('moveCharacter_bypath', { tilePath, targetTile: this })
      })
    }
  }

  setDot() {
    this.dot.setVisible(true)
    this.borderRec.setVisible(false)
  }

  setBorderRec() {
    this.dot.setVisible(false)
    this.borderRec.setVisible(true)
  }
  
  clearIndicator() {
    this.dot.setVisible(false)
    this.borderRec.setVisible(false)
  }

}

export default class Floor extends Phaser.GameObjects.Group {
  constructor(scene, { column, row, floor }, { colliders = [], character }) {
    super(scene)
    this.scene = scene
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.column = column
    this.row = row
    this.floor = floor

    this.playerevents = character.CharacterEvent
    //創建樓層時必須指定acceptable的位置
    this.colliders = colliders
    //用於進行路徑搜尋
    this.pathfinder = new PathFinding(character)

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
          floor: this.floor,
          acceptable: this.is_acceptable([y, x]),
          playerevents: this.playerevents,
          pathfinder: this.pathfinder
        }
        const tile = new Tile(this.scene, options).setOrigin(0.5, 1)
        if (x < 7 && y < 3 && this.floor === 1) {
          tile.setTint(0X53788C)
        }
        this.add(tile)
      }
    }
    this.pathfinder.init(this.getChildren())
  }
  is_acceptable(index) {
    for (let i = 0; i < this.colliders.length; i++) {
      const element = this.colliders[i];
      if (element[0] == index[0] &&
          element[1] == index[1]) {
        console.log(element)
        return false
      }
    }
    return true
  }
}