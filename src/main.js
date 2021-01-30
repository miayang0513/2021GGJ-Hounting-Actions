import Phaser from 'phaser'
import BootScene from './scenes/boot-scene.js'
import PlayScene from './scenes/play-scene.js'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin'
import MouseWheelToUpDownPlugin from 'phaser3-rex-plugins/plugins/mousewheeltoupdown-plugin.js'


const game = new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.ENVELOP,
    // mode: Phaser.Scale.FIT,
    resolution: window.devicePixelRatio,
    width: screen.width,
    height: screen.height
  },
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [BootScene, PlayScene],
  plugins: {
    scene: [
      {
        key: 'rexGestures',
        plugin: GesturesPlugin,
        mapping: 'rexGestures'
      },
      {
        key: 'rexMouseWheelToUpDown',
        plugin: MouseWheelToUpDownPlugin,
        start: true
      },
    ]
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  }
})

console.log('Hello World')