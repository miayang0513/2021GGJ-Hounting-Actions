import { Scene } from 'phaser'

import tile from '../assets/images/tile-1.png'
import wall from '../assets/images/wall.png'
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  init () {
  }
  preload () {
    this.load.image('tile', tile)
    this.load.image('wall', wall)
  }
  async create () {
    console.log('boot scene created')
    this.scene.start('PlayScene')
  }
}
