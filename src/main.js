import Phaser from 'phaser'
import BootScene from './scenes/boot-scene.js'
import PlayScene from './scenes/play-scene.js'

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
	fps: {
		target: 60,
		forceSetTimeOut: true
	}
})

console.log('Hello World')