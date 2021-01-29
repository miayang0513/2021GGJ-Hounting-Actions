/* eslint-disable */
import { Scene } from 'phaser'
export default class GameScene_Izumi extends Scene {
  constructor () {
    super({ key: 'GameScene_Izumi' })
    this.createCompleted = false
  }
  init () {
  }
  preload () {
	}
  async create () {
  }
  update(){
    console.log("GAME!!");
  }
}
