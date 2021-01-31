import { Scene } from 'phaser'
import Floor from '../utils/floor'
import Wall from '../utils/wall'
import Item from '../utils/item'
import store from '../store'
import Character from '../utils/character'
import Monster from '../utils/monster'
export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
    this.centerX = screen.width / 2
    this.centerY = screen.height / 2
    this.firstFloor = null
    this.secondFloor = null
    this.wall = null
  }
  init () {
    this.Character_instance = new Character(this, 40, 40, 'character')
  }
  preload () {
  }
  async create () {
    store.dispatch('showNotification', { message: 'GAME START' })
    this.cameras.main.setZoom(0.7)
    const shadow = this.add.image(this.centerX, this.centerY + 900, 'tile-shadow').setOrigin(0.5, 1).setDepth(0.1)
    this.wall = new Wall(this, {
      x: this.centerX,
      y: this.centerY + 295,
      texture: 'wall',
      depth: 0
    }).setOrigin(0.5, 1)



    var firstFloor_collider = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
    this.firstFloor = new Floor(this, { column: 9, row: 9, floor: 1 }, { colliders: firstFloor_collider, pathfinder: this.Pathfinding, character: this.Character_instance })
    this.secondFloor = new Floor(this, { column: 7, row: 3, floor: 2 }, { acceptable: [], pathfinder: this.Pathfinding, character: this.Character_instance })

    // ↓這個方法可以直接設定玩家的樓層↓
    this.Character_instance.setFloor(this.firstFloor, 4, 4, true)

    // ↓把會死的第二層設定出來↓
    this.setFallRange()
    // item setting
    this.pliers = new Item(this, 'pliers', 'ground', { column: 9, row: 6, floor: 1 }).setOrigin(0.5, 1)
    this.table = new Item(this, 'table', 'ground', { column: 1, row: 8, floor: 1 }).setOrigin(0.5, 1)
    this.window = new Item(this, 'window', 'wall', { depth: 1000, x: this.centerX - 192 * 1.5, y: this.centerY + 400 }).setOrigin(0.5, 1)
    this.groove = new Item(this, 'groove', 'wall', { depth: 1000, x: this.centerX + 192 * 2.25, y: this.centerY - 192, column: 5, row: 1, floor: 2 }).setOrigin(0.5, 1)
    this.curtain = new Item(this, 'curtain', 'wall', { depth: 560, x: this.centerX - 192 * 0.8, y: this.centerY - 192 * 1.2, column: 1, row: 2, floor: 2 }).setOrigin(0.5, 1)
    this.pipe = new Item(this, 'pipe', 'wall', { depth: 1000, x: this.centerX + 192 * 1.2, y: this.centerY - 192 * 2, column: 3, row: 1 }).setOrigin(0.5, 1)
    this.nail = new Item(this, 'nail', 'wall', { depth: 1000, x: this.centerX + 192 * 1.3, y: this.centerY + 192 * 1.3 }).setOrigin(0.5, 1)
    this.exit = this.add.sprite(this.centerX + 192 * 4, this.centerY + 192 * 1.37, 'openExit').setOrigin(0.5, 1).setDepth(1000).setVisible(false)
    this.createAnim('openExitAnim', 'exit', 'open-exit', 18)
    this.fakeDoor = new Item(this, 'fake-door', 'wall', { depth: 2000, x: this.centerX - 192 * 1.7, y: this.centerY + 192 * 3 }).setOrigin(0.5, 1)
    this.reflection = new Item(this, 'reflection', 'wall', { depth: 1000, x: this.centerX - 192 * 1.1, y: this.centerY + 192 * 1.5 }).setOrigin(0, 1).setVisible(false)
    this.littleMonster = new Item(this, 'little-monster', 'ground', { column: 3, row: 1, floor: 2 }).setOrigin(0.5, 1)

    this.bigMonster = new Monster(this, this.centerX + 192 * 3.7, this.centerY + 192 * 1.4).setOrigin(0.5, 1)

    this.mountDragEvent()
    this.mountWheelEvent()
  }

setFallRange () {

    var searchTiles = this.firstFloor.getChildren()
    var tTiles = [searchTiles[7], searchTiles[16], searchTiles[25]]
    for (let index = 27; index < 35; index++) { tTiles.push(searchTiles[index]) }
    var addTiles = []
    for (let i = 0; i < tTiles.length; i++) {
      const element = tTiles[i]
      var newInstance = element.copy()
      newInstance.setInvisible()
      newInstance.acceptable = true
      newInstance.pathfinder = this.secondFloor.pathfinder
      addTiles.push({
        tile: newInstance,
        x: newInstance.coordinateX,
        y: newInstance.coordinateY,
        floor: this.secondFloor
      })
    }

    this.secondFloor.addTiles(addTiles)
    this.secondFloor.setInteractable(false)
  }

  mountDragEvent () {
    const pinch = this.rexGestures.add.pinch()
    const camera = this.cameras.main
    pinch
      .on('drag1', function (pinch) {
        const drag1Vector = pinch.drag1Vector
        camera.scrollX -= drag1Vector.x / camera.zoom
        camera.scrollY -= drag1Vector.y / camera.zoom
      })
  }
  mountWheelEvent () {
    this.deltaY = 0
    this.input.on('wheel', (pointer, gameObject, deltaX, deltaY, deltaZ) => {
      let zoom = this.cameras.main.zoom + deltaY / 1000
      if (zoom <= 0.3) {
        zoom = 0.3
      } else if (zoom >= 3) {
        zoom = 3
      }
      this.cameras.main.setZoom(zoom)
    })
  }
  update () {
    if (this.Character_instance.floor) {
      this.Character_instance.floor.pathfinder.Finder.calculate()
    }
    var spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    if (Phaser.Input.Keyboard.JustDown(spacebar)) {
      this.Character_instance.setFloor(this.secondFloor, 5, 2, false)
    }
  }
  createAnim (key, name, atlas, endFrame) {
    const config = {
      key: key,
      frames: this.anims.generateFrameNames(atlas, {
        prefix: name + '_',
        suffix: '.png',
        start: 0,
        zeroPad: 3,
        end: endFrame
      }),
      frameRate: 25
    }
    this.anims.create(config)
  }
}
