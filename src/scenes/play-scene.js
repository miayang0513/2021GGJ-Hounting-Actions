import { Scene } from 'phaser'
import Tile from '../utils/tile'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.tileGroup = null
  }
  init () {
  }
  preload () {
  }
  async create () {
    this.mountDragEvent()
    this.placeTiles(9)
    console.log('play scene created')
  }
  mountDragEvent () {
    const pinch = this.rexGestures.add.pinch()
    const camera = this.cameras.main
    pinch
      .on('drag1', function (pinch) {
        const drag1Vector = pinch.drag1Vector
        camera.scrollX -= drag1Vector.x / camera.zoom
        camera.scrollY -= drag1Vector.y / camera.zoom
      })
  }
  placeTiles (scale) {
    this.tileGroup = this.add.group()
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2

    for (let y = 0; y < scale; y++) {
      for (let x = 0; x < scale; x++) {
        let tx = (x - y) * tileWidthHalf
        let ty = (x + y) * tileHeightHalf
        const options = {
          x: this.centerX + tx,
          y: this.centerY + ty,
          texture: 'tile',
          depth: this.centerY + ty,
          coordinateX: x,
          coordinateY: y
        }
        const tile = new Tile(this, options).setOrigin(0.5, 1)
        this.tileGroup.add(tile)
      }
    }
  }
}
