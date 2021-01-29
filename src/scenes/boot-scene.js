/* eslint-disable */
import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
    this.createCompleted = false
  }
  init () {
  }
  preload () {
	}
  async create () {
    this.createCompleted = true
    console.log('boot scene created')
  }
}
