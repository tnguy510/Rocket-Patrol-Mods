class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload(){
        //load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth:64, frameHeight: 32,
        startFrame: 0, endFrame: 9});
        this.load.spritesheet('sonicDeath', './assets/death.png', {frameWidth: 29, frameHeight: 29,
        startFrame: 0, endFrame: 5});
        this.load.image('sonic', './assets/sonic.png');

    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00FF00).setOrigin(0,0);

        //add spaceships(x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4,
            'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 +
            borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4,
            'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new SonicSpaceship(this, game.config.width, borderUISize*8 + borderPadding*4,
            'sonic', 0, 100).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize,
            0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height,
            0xFFFFFF).setOrigin(0, 0);
            
        //  add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize -
        borderPadding, 'rocket').setOrigin(0.5,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('sonicDeath', {start: 0, end: 5, first: 0}),
            frameRate: 30
        });

        //initialize score
        this.p1Score = 0;
        //display score
        this.hitBonus = 0;
        this.explosionSFX = ['sfx_explosion1', 'sfx_explosion2', 'sfx_explosion3', 'sfx_explosion4'];
        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2,
            this.p1Score, scoreConfig);

        //GAME OVER flag
        this.gameOver = false;

        //Countdown clock
        this.gameCountdown = game.settings.gameTimer
        scoreConfig.fixedWidth = 0;

        //30 second Speed up Timer 
        this.speedUp = this.time.delayedCall(game.settings.speedTimer, () => {
            this.ship01.moveSpeed *= 2;
            this.ship02.moveSpeed *= 2;
            this.ship03.moveSpeed *= 2;
            this.ship04.moveSpeed *= 2;
        }, null, this);

        this.clockRight = this.add.text(borderUISize + borderPadding*43, borderUISize + borderPadding*2,
            this.gameCountdown, clockConfig)
    }

    update() {
        if(this.gameCountdown <= 0){
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER',
            scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu',
            scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }
          // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        //check collision
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
        //create explosion sprite at ship's position
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.sonicDeath(this.ship04);
        }
        if(!this.gameOver){
            this.gameCountdown -= 17;
            if(this.gameCountdown <= 0){
                this.clockRight.text = 0;
            }
            else{
                this.clockRight.text = Phaser.Math.RoundTo((this.gameCountdown * 0.001), 0);
            }
        }

    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        this.hitBonus += 1;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play(Phaser.Math.RND.pick(this.explosionSFX));
        if(this.hitBonus >= 3){
            this.gameCountdown += 5000;
            this.hitBonus = 0;
        }
    }

    sonicDeath(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        this.hitBonus += 1;

        let dead = this.add.sprite(ship.x, ship.y, 'sonicDeath').setOrigin(0, 0);
        dead.anims.play('death');
        dead.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            dead.destroy();
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play(Phaser.Math.RND.pick(this.explosionSFX));
        this.gameCountdown += 8000;
        if(this.hitBonus >= 3){
            this.gameCountdown += 5000;
            this.hitBonus = 0;
        }
    }
 }