let info;
let timer;
let alive = 0;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }
    /**
     *   Load the game assets.
     */
    preload() {
        this.load.image('strawberry', 'assets/strawberry.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('ananas', 'assets/ananas.png');
        this.load.image('cherry', 'assets/cherry.png');
        this.load.image('bonhomme', 'assets/bonhomme.png');
    }

    /**
     *   Create the game objects (images, groups, sprites and animations).
     */
    create() {
        let scaleFruit =
            this.game.config.width > this.game.config.height
                ? this.game.config.width * 0.0001
                : this.game.config.height * 0.0002;

        let bonhomme = this.physics.add.image(this.game.config.width / 2, this.game.config.height - 100, 'bonhomme');
        bonhomme.setImmovable(true);
        bonhomme.setScale(scaleFruit).setScrollFactor(0);
        bonhomme.body.gravity.y = 0;
        this.input.on(
            'pointermove',
            function (pointer) {
                bonhomme.setVelocityX(pointer.x - bonhomme.body.x);
            },
            this
        );
        for (var i = 0; i < 12; i++) {
            var x = Phaser.Math.Between(100, this.game.config.width - 100);
            var y = 0;
            if (i % 4 == 0) {
                let ananas = this.physics.add.image(x, y, 'ananas');

                ananas.setScale(scaleFruit).setScrollFactor(0);
                ananas.allowGravity = true;
                ananas.setGravityY(100);
                ananas.setInteractive();

                //  The images will dispatch a 'clicked' event when they are clicked on
                ananas.on('clicked', this.clickHandler, this);
                console.log('modulo');
            } else if (i % 2 == 0) {
                var strawberry = this.physics.add.image(x, y, 'strawberry');
                strawberry.setScale(scaleFruit).setScrollFactor(0);
                strawberry.allowGravity = true;
                strawberry.setGravityY(100);
                //  Make them all input enabled
                strawberry.setInteractive();

                //  The images will dispatch a 'clicked' event when they are clicked on
                strawberry.on('clicked', this.clickHandler, this);
            } else if (i % 3 == 0) {
                var banana = this.physics.add.image(x, y, 'banana');
                banana.setScale(scaleFruit).setScrollFactor(0);
                banana.allowGravity = true;
                banana.setGravityY(100);
                //  Make them all input enabled
                banana.setInteractive();

                //  The images will dispatch a 'clicked' event when they are clicked on
                banana.on('clicked', this.clickHandler, this);
            } else if (i % 1 == 0) {
                var cherry = this.physics.add.image(x, y, 'cherry');
                cherry.setScale(scaleFruit).setScrollFactor(0);
                cherry.allowGravity = true;
                cherry.setGravityY(100);
                //  Make them all input enabled
                cherry.setInteractive();

                //  The images will dispatch a 'clicked' event when they are clicked on
                cherry.on('clicked', this.clickHandler, this);
            }

            alive++;
        }

        //  If a Game Object is clicked on, this event is fired.
        //  We can use it to emit the 'clicked' event on the game object itself.
        this.input.on(
            'gameobjectup',
            function (pointer, gameObject) {
                gameObject.emit('clicked', gameObject);
            },
            this
        );

        //  Display the game stats
        info = this.add.text(10, 10, '', { font: '48px Arial', fill: '#000000' });

        timer = this.time.addEvent({ delay: 10000, callback: this.gameOver, callbackScope: this });
    }

    update() {
        info.setText('Alive: ' + alive + '\nTime: ' + Math.floor(10000 - timer.getElapsed()));
    }

    clickHandler(fruit) {
        alive--;

        fruit.off('clicked', this.clickHandler);
        fruit.input.enabled = false;
        fruit.setVisible(false);
    }

    gameOver() {
        this.input.off('gameobjectup');
    }
}
