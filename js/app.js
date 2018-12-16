var mainState = {
    preload: function () {
        // Map sprites
        game.load.image('ground', 'assets/bush.png');
        game.load.image('innerwall', 'assets/wall.png');
        game.load.image('wall', 'assets/palma.png');
        game.load.image('brick', 'assets/flamingo.png');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/eksplozja.png');

        // Player sprites
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('bomber-front', 'assets/bomber-front.png');
        game.load.image('bomber-left', 'assets/bomber-left.png');
        game.load.image('bomber-right', 'assets/bomber-right.png');
        game.load.image('bomber-back', 'assets/bomber-back.png');

        // Power up sprites
        game.load.image('boots', 'assets/lemon.png');
        game.load.image('star', 'assets/strawberry.png');

        //other sprites
        game.load.image('background', 'assets/b22.jpg');
    },

    create: function () {
        this.BLOCK_COUNT = 15;
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT;

        game.add.image(0, 0, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        // Group container of game sprites
        this.wallList = game.add.group();
        this.bootList = game.add.group();
        this.starList = game.add.group();
        this.brickList = game.add.group();
        this.bombList = game.add.group();
        this.explosionList = game.add.group();

        this.addPlayers();
        this.createMap();

        this.playerSpeed = 150;
        this.playerPower = false;
        this.playerDrop = true;

        // Creates listeners for player 1's controls
        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function () {

        if (this.aKey.isDown || this.sKey.isDown || this.dKey.isDown || this.wKey.isDown) {
            if (this.aKey.isDown) {
                this.player.body.velocity.x = -(this.playerSpeed);
                this.player.loadTexture('bomber-left', 0);
            }
            if (this.dKey.isDown) {
                this.player.body.velocity.x = (this.playerSpeed);
                this.player.loadTexture('bomber-right', 0);
            }
            if (this.wKey.isDown) {
                this.player.body.velocity.y = -(this.playerSpeed);
                this.player.loadTexture('bomber-back', 0);
            }
            if (this.sKey.isDown) {
                this.player.body.velocity.y = (this.playerSpeed);
                this.player.loadTexture('bomber-front', 0);
            }
        } else {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp) {
            if (gameInPlay)
                this.dropBomb(1);
        }

        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.overlap(this.player, this.explosionList, function () {
            this.burn(1);
        }, null, this);

        game.physics.arcade.overlap(this.player, this.bootList, function () {
            this.speedUp(1);
        }, null, this);

        game.physics.arcade.overlap(this.player, this.starList, function () {
            this.starUp(1);
        }, null, this);
    },

    createMap: function () {
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1) {
                    this.addWall(x, y);
                } else if (x % 2 === 0 && y % 2 === 0) {
                    this.addInnerWall(x, y);
                } else {
                    if (Math.floor(Math.random() * 3)) {
                        this.addBrick(x, y);
                        if (Math.floor(Math.random() * 1.02)) {
                            this.addBoots(x, y);
                        }
                        if (Math.floor(Math.random() * 1.02)) {
                            this.addStar(x, y);
                        }
                    }
                }
            }
        }
    },

    burn: function () {
        this.player.kill();
    },

    speedUp: function () {
        this.playerSpeed = 350;
        this.bootList.forEach(function (element) {
            element.kill();
        });
    },

    addBoots: function (x, y) {
        var boots = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'boots');
        game.physics.arcade.enable(boots);
        boots.body.immovable = true;
        this.bootList.add(boots);
    },

    starUp: function () {
        this.playerPower = true;

        this.starList.forEach(function (element) {
            element.kill();
        });
    },

    addStar: function (x, y) {
        var star = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'star');
        game.physics.arcade.enable(star);
        star.body.immovable = true;
        this.starList.add(star);
    },

    addPlayers: function () {
        this.player = game.add.sprite(1 * this.PIXEL_SIZE, 1 * this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player);
    },

    addWall: function (x, y) {
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        game.physics.arcade.enable(wall);
        wall.body.immovable = true;
        this.wallList.add(wall);

    },

    addInnerWall: function (x, y) {
        var innerwall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'innerwall');
        game.physics.arcade.enable(innerwall);
        innerwall.body.immovable = true;
        this.wallList.add(innerwall);
    },

    addBrick: function (x, y) {
        var brick = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'brick');
        game.physics.arcade.enable(brick);
        brick.body.immovable = true;
        this.brickList.add(brick);

    },

    detonateBomb: function (x, y, explosionList, wallList, brickList) {
        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];

        if (mainState.playerPower) {
            fire.push(game.add.sprite(x, y + 80, 'explosion'));
            fire.push(game.add.sprite(x, y - 80, 'explosion'));
            fire.push(game.add.sprite(x + 80, y, 'explosion'));
            fire.push(game.add.sprite(x - 80, y, 'explosion'));
        }

        for (var i = 0; i < fire.length; i++) {
            fire[i].body.immovable = true;
            explosionList.add(fire[i]);
        }

        for (i = 0; i < fire.length; i++) {
            if (game.physics.arcade.overlap(fire[i], wallList)) {
                fire[i].kill();
                if (i > 0 && fire[i + 4] !== undefined) {
                    fire[i + 4].kill();
                }
            }
        }

        setTimeout(function () {
            explosionList.forEach(function (element) {
                element.kill();
            });
            var temp = brickList.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (element.x == fire[i].x && element.y == fire[i].y) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });
        }, 500);
    },

    dropBomb: function () {
        var gridX;
        var gridY;
        var bomb;
        var detonateBomb;
        var explosionList;
        var wallList;
        var brickList;

        if (this.playerDrop) {
            this.playerDrop = false;
            gridX = this.player.x - this.player.x % 40;
            gridY = this.player.y - this.player.y % 40;

            bomb = game.add.sprite(gridX, gridY, 'bomb');
            game.physics.arcade.enable(bomb);
            bomb.body.immovable = true;
            this.bombList.add(bomb);

            detonateBomb = this.detonateBomb;
            explosionList = this.explosionList;
            wallList = this.wallList;
            brickList = this.brickList;

            setTimeout(function () {
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList, wallList, brickList);
                mainState.enablePlayerBomb(1);
            }, 1000);

            setTimeout(this.thisEnableBomb, 2000);
        }

    },

    enablePlayerBomb: function () {
        this.playerDrop = true;
    },
};

var GAME_SIZE = 600;
var gameInPlay = true;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');