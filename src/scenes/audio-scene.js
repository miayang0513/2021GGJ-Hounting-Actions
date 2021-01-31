import { Scene } from 'phaser'
import gameBgm from '../assets/audios/game-bgm.mp3'
import waterDrop from '../assets/audios/game-waterdrop.mp3'
import walkAudio from '../assets/audios/ch-walk.mp3'
import uiDie from '../assets/audios/ui-die.mp3'
import uiWin from '../assets/audios/ui-win.mp3'

export default class AudioScene extends Scene {
  constructor () {
    super({ key: 'AudioScene' })
  }
  init () {
    console.log('audio init')
  }
  preload () {
    console.log(gameBgm)
    this.load.audio('game-bgm', gameBgm)
    this.load.audio('water-drop', waterDrop)
    this.load.audio('walk-audio', walkAudio)
  }
  create () {
    this.bgm = this.sound.add('game-bgm', { loop: true })
    this.waterdrop = this.sound.add('water-drop', { loop: true, volume: 0.1, rate: 0.6 })
    this.walkAudio = this.sound.add('walk-audio', { volume: 0.7 })

    this.bgm.play()
    this.waterdrop.play()
  }
}