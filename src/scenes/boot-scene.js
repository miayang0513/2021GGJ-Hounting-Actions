import { Scene } from 'phaser'

import tile from '../assets/images/tile-1.png'
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  init () {
  }
  preload () {
    this.load.image('tile', tile)
  }
  async create () {
    console.log('boot scene created')
    this.scene.start('PlayScene')
  }
}
