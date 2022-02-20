export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    /**
     *   Load the game assets.
     */
    preload() {}

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // Set background
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        // init text
        let text = this.add.bitmapText(
            this.game.config.width / 2,
            this.game.config.height / 4,
            'mkart',
            ['REJOUEZ'],
            64
        );
        text.x = this.game.config.width / 2 - text.width / 2;
        text.setInteractive();
        text.on('pointerdown', this.goToMainScene, this);
    }

    /**
     * Navigate to Select scene
     */
    goToMainScene() {
        this.scene.start('MainScene');
    }
}
