let info;
let timer;
let bomb;
let score = 0;
let fruits;
let life;
let delay = 5000;
let numberOfFruit = 1;
let delayBomb;
let vie = 3;
let isPaused = false;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    /**
     *   Load the game assets.
     */
    preload() {
        this.load.spritesheet('fruits', 'assets/fruits-sprite.png', {
            frameWidth: 512,
            frameHeight: 512,
        });
        this.load.image('life', 'assets/life.png');
        this.load.image('bomb', 'assets/bomb.png');
    }

    /**
     *  Create the game objects (images, groups, sprites and animations).
     */
    create() {
        // Init bomb delay
        delayBomb = Phaser.Math.Between(20000, 40000);

        // Init background
        let background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.displayWidth = this.game.config.width;
        background.displayHeight = this.game.config.height;
        this.scaleFruit =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.0001
                : this.game.config.width * 0.0002;

        // Init bonhomme
        this.bonhomme = this.physics.add.image(this.game.config.width / 2, this.game.config.height - 100, 'bonhomme');
        this.bonhomme.setInteractive();
        this.bonhomme.setScale(this.scaleFruit).setScrollFactor(0);
        this.bonhomme.body.gravity.y = 0;
        this.bonhomme.body.collideWorldBounds = true;
        this.input.setDraggable(this.bonhomme);

        fruits = this.physics.add.group();
        bomb = this.physics.add.group();
        // Drag on x axis
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (isPaused) {
                this.resume();
            }

            gameObject.y = gameObject.y;
            gameObject.x = dragX;
        });

        // Drag on x axis
        this.input.on('dragend', (pointer, gameObject, dragX, dragY) => {
            this.pause();
        });

        // Create groups
        life = this.physics.add.group();

        // Create the lifes
        for (let i = 1; i < vie + 1; i++) {
            this.createLife(i);
        }

        // Display the game stats
        info = this.add.bitmapText(10, 10, 'mkart');

        // Init timer for creating fruit
        this.timer = this.time.addEvent({
            delay: delay,
            callback: this.createFruit,
            callbackScope: this,
            loop: true,
            paused: false,
        });

        // Init timerbomb that is displayed for bombs
        this.bombTimer = this.time.addEvent({
            delay: delayBomb,
            callback: this.createBomb,
            callbackScope: this,
            loop: true,
            paused: false,
        });

        // Create first fruit
        this.createFruit();
    }

    /**
     * Create a bomb
     */
    createBomb() {
        var b = bomb.create(Phaser.Math.Between(0 + 100, this.game.config.width - 100), 0, 'bomb');
        b.setScale(this.scaleFruit).setScrollFactor(0);
        b.allowGravity = true;
        b.setGravityY(100);
        b.body.immovable = true;
    }

    /**
     *  Update the scene frame by frame, responsible for move and rotate the bird and to create and move the pipes.
     */
    update() {
        this.physics.world.collide(this.bonhomme, fruits, this.collisionHandlerFruit, null, this);
        this.physics.world.collide(this.bonhomme, bomb, this.collisionHandlerBomb, null, this);
        fruits.getChildren().forEach(function (fruit) {
            if (fruit.body.y > this.game.config.height) {
                fruit.destroy();
                vie = vie - 1;
                life.remove(life.getLast(true), true);
            }
        }, this);

        bomb.getChildren().forEach(function (bomb) {
            if (bomb.body.y > this.game.config.height) {
                bomb.destroy();
            }
        }, this);

        if (vie == 0) {
            this.gameOver();
        }
        info.setText(this.game.config.width > this.game.config.height ? 'SCORE ' + score : '' + score);
        info.x = this.game.config.width - info.width - this.game.config.width * 0.01;
    }

    /**
     *  Create a fruit
     */
    async createFruit() {
        for (let i = 0; i < numberOfFruit; i++) {
            const timerInfruit = (ms) => new Promise((res) => setTimeout(res, ms));
            var c = fruits.create(Phaser.Math.Between(0 + 100, this.game.config.width - 100), 0, 'fruits');
            c.setScale(this.scaleFruit).setScrollFactor(0);
            c.setFrame(Phaser.Math.Between(0, 3));
            c.allowGravity = true;
            c.setGravityY(100);
            c.body.immovable = true;
            await timerInfruit(500);
        }
    }

    /**
     * This function create the life in fonction of
     * @param {*} lifeNumber Number of lifes created
     */
    createLife(lifeNumber) {
        var c = life.create(0, 100, 'life');
        c.setScale(this.scaleFruit).setScrollFactor(0);
        c.y = (c.body.height * this.scaleFruit) / 2;
        c.x = lifeNumber * c.body.width * this.scaleFruit;
    }

    /**
     * Handle collision with a fruit to update the score
     * @param {*} bonhomme  the bonhomme object
     * @param {*} fruit The fruit object
     */
    collisionHandlerFruit(bonhomme, fruit) {
        score = score + 1;
        fruit.destroy();
        if (score % 5 == 0) {
            numberOfFruit = numberOfFruit + 1;
            delay = delay - 500;
        }
    }

    /**
     * Handle collision with a bomb to update the score
     * @param {*} bonhomme  the bonhomme object
     * @param {*} bomb The bomb object
     */
    collisionHandlerBomb(bonhomme, bomb) {
        vie = vie - 1;
        life.remove(life.getLast(true), true);
        bomb.destroy();
    }

    /**
     * Pause games animations
     */
    pause() {
        isPaused = true;
        //Pause timers
        this.timer.paused = true;
        this.timerBomb = true;

        // Stop fruits
        fruits.getChildren().forEach(function (fruit) {
            fruit.body.moves = false;
        }, this);
        // Stop bombs
        bomb.getChildren().forEach(function (bomb) {
            bomb.body.moves = false;
        }, this);
    }

    /**
     * Resure game animations
     */
    resume() {
        isPaused = false;
        // Unpause timers
        this.timer.paused = false;
        this.timerBomb = false;

        // let move fruits
        fruits.getChildren().forEach(function (fruit) {
            fruit.body.moves = true;
        }, this);
        // let move bombs
        bomb.getChildren().forEach(function (bomb) {
            bomb.body.moves = true;
        }, this);
    }

    /**
     * Reset params on game over and go to end scene
     */
    gameOver() {
        delay = 10000;
        numberOfFruit = 1;
        vie = 3;
        score = 0;
        this.scene.start('EndScene');
    }
}
