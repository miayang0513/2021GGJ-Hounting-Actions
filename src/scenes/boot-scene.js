import { Scene } from 'phaser'

import tileLight from '../assets/images/tile-light.png'
import tileDark from '../assets/images/tile-dark.png'
import wall from '../assets/images/wall.png'
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  init () {
  }
  preload () {
    this.load.image('tile-light', tileLight)
    this.load.image('tile-dark', tileDark)
    this.load.image('wall', wall)
  }
  async create () {
    console.log('boot scene created')
    this.scene.start('PlayScene')
  }
}
