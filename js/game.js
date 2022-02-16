import MainScene from './MainScene.js';

/**
 * Configuration of the game
 */
const configurations = {
    type: Phaser.AUTO,
    backgroundColor: 0x87ceeb,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'fruitChase',
        width: window.innerWidth,
        height: window.innerHeight,
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        fps: 60,
        arcade: {
            debut: true,
        },
    },
    scene: [MainScene],
};

/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
new Phaser.Game(configurations);
