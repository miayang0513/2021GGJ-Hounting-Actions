import { Scene } from 'phaser'
import tileLight from '../assets/images/tile-light.png'
import tileDark from '../assets/images/tile-dark.png'
import tileShadow from '../assets/images/tile-shadow.png'
import tileEmpty from '../assets/images/tile-empty.png'
import wall from '../assets/images/wall.png'

import openExitPng from '../assets/animations/open-exit.png'
import openExitJson from '../assets/animations/open-exit.json'
import characterPng from '../assets/animations/character.png'
import characterJson from '../assets/animations/character.json'
import bigMonsterPng from '../assets/animations/big-monster.png'
import bigMonsterJson from '../assets/animations/big-monster.json'

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
import dot from '../assets/images/dot.png'
import borderRec from '../assets/images/border-rec.png'
import itemIndicator from '../assets/images/item-indicator.png'
import littleMonster from '../assets/images/little-monster.png'
import littleMonsterUmbrella from '../assets/images/little-monster_umbrella.png'
import cleanTable from '../assets/images/clean-table.png'

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
    this.load.image('tile-empty', tileEmpty)
    this.load.image('wall', wall)

    this.load.atlas('character', characterPng, characterJson)
    this.load.atlas('big-monster', bigMonsterPng, bigMonsterJson)
    this.load.atlas('open-exit', openExitPng, openExitJson)

    this.load.image('pliers', pliers)
    this.load.image('window', window)
    this.load.image('groove', groove)
    this.load.image('groove-diamond', grooveDiamond)
    this.load.image('curtain', curtain)
    this.load.image('pipe', pipe)
    this.load.image('table', table)
    this.load.image('nail', nail)
    this.load.image('rope', rope)
    this.load.image('fake-door', faceDoor)
    this.load.image('reflection', reflection)
    this.load.image('dot', dot)
    this.load.image('borderRec', borderRec)
    this.load.image('itemIndicator', itemIndicator)
    this.load.image('little-monster', littleMonster)
    this.load.image('little-monster-umbrella', littleMonsterUmbrella)
    this.load.image('clean-table', cleanTable)
  }
  async create () {
    console.log('boot scene created')

    const graphics = this.add.graphics().setScrollFactor(0)
    graphics.fillGradientStyle(0x172C40, 0x172C40, 0x0C1529, 0x0C1529, 1)
    graphics.fillRect(0, 0, this.sys.scale.width / 0.6, this.sys.scale.height / 0.6)

    this.scene.launch('PlayScene')
    this.scene.launch('AudioScene')
  }
}
