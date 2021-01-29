import { Scene } from 'phaser'
import Tile from '../utils/tile'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }
  init () {
    this.tileGroup = this.add.group()
  }
  preload () {
  }
  async create () {
    this.placeTiles(10)
    console.log('play scene created')

  }
  placeTiles (scale) {
    const tileWidth = 192
    const tileHeight = 96
    const tileWidthHalf = tileWidth / 2
    const tileHeightHalf = tileHeight / 2
    let centerX = screen.width / 2
    let centerY = screen.height / 2

    for (let y = 0; y < scale; y++) {
      for (let x = 0; x < scale; x++) {
        let tx = (x - y) * tileWidthHalf
        let ty = (x + y) * tileHeightHalf
        const options = {
          depth: centerY + ty,
          coordinateX: x,
          coordinateY: y
        }
        const tile = new Tile(this, centerX + tx, centerY + ty, 'tile', options).setOrigin(0.5, 1)
        this.tileGroup.add(tile)
      }
    }
  }
}
