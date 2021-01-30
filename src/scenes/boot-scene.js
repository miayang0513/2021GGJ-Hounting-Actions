import { Scene } from 'phaser'
import tileLight from '../assets/images/tile-light.png'
import tileDark from '../assets/images/tile-dark.png'
import tileShadow from '../assets/images/tile-shadow.png'
import wall from '../assets/images/wall.png'

import character_png from '../assets/animations/senior-walk.png'
import character_an from '../assets/animations/senior-walk.json'
import openExitPng from '../assets/animations/open-exit.png'
import openExitJson from '../assets/animations/open-exit.json'

import pliers from '../assets/images/pliers.png'
import window from '../assets/images/window.png'
import groove from '../assets/images/groove.png'
import grooveDiamond from '../assets/images/groove-diamond.png'
import curtain from '../assets/images/curtain.png'
import pipe from '../assets/images/pipe.png'
import table from '../assets/images/table.png'
import nail from '../assets/images/nail.png'
import rope from '../assets/images/rope.png'
import faceDoor from '../assets/images/fake-door.png'
import reflection from '../assets/images/reflection.png'

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
    this.load.atlas('character_atlas', character_png, character_an)
    this.load.atlas('openExit', openExitPng, openExitJson)

    this.load.image('pliers', pliers)
    this.load.image('window', window)
    this.load.image('groove', groove)
    this.load.image('grooveDiamond', grooveDiamond)
    this.load.image('curtain', curtain)
    this.load.image('pipe', pipe)
    this.load.image('table', table)
    this.load.image('nail', nail)
    this.load.image('rope', rope)
    this.load.image('fakeDoor', faceDoor)
    this.load.image('reflection', reflection)
  }
  async create () {
    console.log('boot scene created')

    const graphics = this.add.graphics().setScrollFactor(0)
    graphics.fillGradientStyle(0x172C40, 0x172C40, 0x0C1529, 0x0C1529, 1)
    graphics.fillRect(0, 0, this.sys.scale.width / 0.6, this.sys.scale.height / 0.6)

    this.scene.launch('PlayScene')
  }
}
