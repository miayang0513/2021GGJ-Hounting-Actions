import Phaser from 'phaser'
import BootScene from './scenes/boot-scene.js'
import PlayScene from './scenes/play-scene.js'
import AudioScene from './scenes/audio-scene.js'
import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin'


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
  scene: [BootScene, AudioScene, PlayScene],
  input: { windowEvents: false },
  plugins: {
    scene: [
      {
        key: 'rexGestures',
        plugin: GesturesPlugin,
        mapping: 'rexGestures'
      }
    ]
  },
  fps: {
    target: 60,
    forceSetTimeOut: true
  }
})

export default game