import { Scene } from 'phaser'
import tileLight from '../assets/images/tile-light.png'
import tileDark from '../assets/images/tile-dark.png'
import tileShadow from '../assets/images/tile-shadow.png'
import wall from '../assets/images/wall.png'

import character_png from '../assets/animations/senior-walk.png'
import character_an from '../assets/animations/senior-walk.json'
import pliers from '../assets/images/pliers.png'
import window from '../assets/images/window.png'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }
  init () {
  }
  preload () {
    this.load.image('tile-light', tileLight)
    this.load.image('tile-dark', tileDark)
    this.load.image('tile-shadow', tileShadow)
    this.load.image('wall', wall)
    this.load.atlas('character_atlas', character_png,character_an)

    this.load.image('pliers', pliers)
    this.load.image('window', window)
  }
  async create () {
    console.log('boot scene created')

    const graphics = this.add.graphics().setScrollFactor(0)
    graphics.fillGradientStyle(0x172C40, 0x172C40, 0x0C1529, 0x0C1529, 1)
    graphics.fillRect(0, 0, this.sys.scale.width / 0.6, this.sys.scale.height / 0.6)

    this.scene.launch('PlayScene')
  }
}
