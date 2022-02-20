export default class StartScene extends Phaser.Scene {
    /**
     *   Load the game assets.
     */
    preload() {
        this.load.image('bonhomme', 'assets/bonhomme.png');
        this.load.image('background', 'assets/backgroundchassefruit.png');
        this.load.bitmapFont('mkart', 'assets/MarioKart.png', 'assets/MarioKart.xml');
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // Scale init
        this.scaleBonhomme =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.0002
                : this.game.config.height * 0.0004;
        // Init background
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        // init text
        let text = this.add.bitmapText(
            this.game.config.width / 2,
            this.game.config.height / 4,
            'mkart',
            ['Cliquez sur Epicio pour commencer'],
            this.game.config.width > this.game.config.height ? 64 : 16
        );
        text.x = this.game.config.width / 2 - text.width / 2;
        // init bonhomme
        this.bonhomme = this.physics.add.image(this.game.config.width / 2, 0, 'bonhomme');
        this.bonhomme.y = this.game.config.height - (this.bonhomme.body.height * this.scaleBonhomme) / 2;
        this.bonhomme.setInteractive();
        this.bonhomme.setScale(this.scaleBonhomme).setScrollFactor(0);
        this.bonhomme.on('pointerdown', this.goToMainScene, this);
    }

    /**
     * Go to Main scene
     */
    goToMainScene() {
        this.scene.start('MainScene');
    }
}
