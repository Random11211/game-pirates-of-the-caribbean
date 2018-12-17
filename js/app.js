var mainState = {
    preload: function () {
        // Map sprites
        game.load.image('treasure', 'assets/skrzynia2.png');
        game.load.image('innerwall', 'assets/palma.png');
        game.load.image('wall', 'assets/palma.png');
        game.load.image('brick', 'assets/flamingo.png');
        game.load.image('background', 'assets/b22.jpg');
        game.load.image('game-over', 'assets/game-over.jpg');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/eksplozja.png');

        // Player sprites
        game.load.image('bomber', 'assets/postac/postac-front.png');
        game.load.image('bomber-front', 'assets/postac/postac-front.png');
        game.load.image('bomber-left', 'assets/postac/postac-left.png');
        game.load.image('bomber-right', 'assets/postac/postac-right.png');
        game.load.image('bomber-back', 'assets/postac/postac-back.png');

        // Power up sprites
        game.load.image('boots', 'assets/lemon.png');
        game.load.image('star', 'assets/strawberry.png');

        //going to next level sprites
        game.load.image('coco', 'assets/coconut.png');
        game.load.image('portal', 'assets/portal.png');

        //enemy sprites
        game.load.image('easy-enemy', 'assets/linux.png');
        game.load.image('normal-enemy', 'assets/statek.png');
        game.load.image('hard-enemy', 'assets/kitty2.png');
    },

    render: function() {
        game.debug.text("Zebrane kokosy: " + this.cocoAmount, 20, 30, "#ADD8E6", "bold 20px Arial");
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
        this.treasureList = game.add.group();
        this.cocoCollectionList = game.add.group();
        this.easyEnemies = game.add.group();
        this.normalEnemies = game.add.group();
        this.hardEnemies = game.add.group();
        this.portalList = game.add.group();

        this.addPlayers();
        this.createMap();

        this.cocoAmount = 5;

        //timer dla wrogow
        timer = game.time.create(false);
        timer.loop(1000, this.resetTimer, this);
        timer.start();

        this.addNormalEnemy(5, 6);
        this.addNormalEnemy(5, 6);
        this.addStrongEnemy(7, 5);
        this.addStrongEnemy(7, 5);

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

    resetTimer: function () {
        enemyCanRun = true;
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

        if (enemyCanRun) {
            enemyCanRun = false;
            this.normalEnemyMove();
            this.hardEnemyMove();
        }

        game.physics.arcade.collide(this.player, this.treasureList);
        game.physics.arcade.collide(this.player, this.cocoCollectionList, this.collectCoco, null, this)
        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.overlap(this.player, this.explosionList, this.burn, null, this);
        game.physics.arcade.overlap(this.player, this.bootList, this.speedUp, null, this);
        game.physics.arcade.overlap(this.player, this.starList, this.starUp, null, this);
        game.physics.arcade.overlap(this.player, this.easyEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.normalEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.hardEnemies, this.enemyCollision, null, this);

        this.normalEnemies.forEach(function (enemy) {
            game.physics.arcade.collide(enemy, this.mainState.wallList);
            game.physics.arcade.collide(enemy, this.mainState.brickList);
        });

        game.physics.arcade.overlap(this.player, this.portalList, this.nextLevel, null, this);

        game.physics.arcade.collide(this.player, this.portalList);
    },

    createMap: function () {
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1) {
                    this.addWall(x, y);
                } else if (x % 2 === 0 && y % 2 === 0) {
                    this.addInnerWall(x, y);
                }
            }
        }
        this.addBrick(1, 3), this.addBrick(1, 4), this.addBrick(1, 10), this.addBrick(1, 11);
        this.addBrick(2, 3), this.addBrick(2, 7);
        this.addBrick(3, 1), this.addBrick(3, 4), this.addBrick(3, 5), this.addBrick(3, 10), this.addBrick(3, 11);
        this.addBrick(4, 3), this.addBrick(4, 5);
        this.addBrick(5, 4), this.addBrick(5, 5), this.addBrick(5, 9), this.addBrick(5, 10), this.addBrick(5, 12), this.addBrick(5, 13);
        this.addBrick(6, 1), this.addBrick(6, 3), this.addBrick(6, 5), this.addBrick(6, 7), this.addBrick(6, 9), this.addBrick(6, 13);
        this.addBrick(7, 1), this.addBrick(7, 2), this.addBrick(7, 3), this.addBrick(7, 5), this.addBrick(7, 6), this.addBrick(7, 8), this.addBrick(7, 9), this.addBrick(7, 13);
        this.addBrick(8, 7), this.addBrick(8, 9), this.addBrick(8, 13);
        this.addBrick(9, 1), this.addBrick(9, 2), this.addBrick(9, 3), this.addBrick(9, 9), this.addBrick(9, 13);
        this.addBrick(10, 3), this.addBrick(10, 9), this.addBrick(10, 11), this.addBrick(10, 13);
        this.addBrick(11, 2), this.addBrick(11, 3), this.addBrick(11, 4), this.addBrick(11, 5), this.addBrick(11, 6), this.addBrick(11, 7), this.addBrick(11, 8), this.addBrick(11, 9), this.addBrick(11, 10);
        this.addBrick(12, 1), this.addBrick(12, 5), this.addBrick(12, 11), this.addBrick(12, 13);
        this.addBrick(13, 4), this.addBrick(13, 5), this.addBrick(13, 6);
        this.addPortal(7, 7);
        this.addBoots(11, 1);
        this.addStar(2, 11);
        this.addTreasure(8, 1), this.addTreasure(8, 5), this.addTreasure(12, 7), this.addTreasure(3, 12), this.addTreasure(7, 12);
    },

    burn: function () {
        this.player.kill();
        this.playerDrop = false;
        this.gameOver();
    },

    addTreasure: function (x, y) {
        var treasure = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'treasure');
        game.physics.arcade.enable(treasure);
        treasure.body.immovable = true;
        this.treasureList.add(treasure);
    },

    addCoco: function (x, y) {
        var coco = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'coco');
        game.physics.arcade.enable(coco);
        coco.body.immovable = true;
        this.cocoCollectionList.add(coco);
    },

    collectCoco: function () {
        this.cocoCollectionList.forEach(function (element) {
            element.kill();
        });
        this.cocoAmount++;
        console.log("Liczba kokosów: " + this.cocoAmount);
    },

    addPortal: function (x, y) {
        var portal = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'portal');
        game.physics.arcade.enable(portal);
        portal.body.immovable = true;
        this.portalList.add(portal);
    },

    nextLevel: function () {
        if (this.cocoAmount >= 5) {
            this.portalList.forEach(function (element) {
                element.kill();
                game.state.start('lvl2');
            })
        }
    },

    gameOver: function () {
        game.add.image(0, 0, 'game-over');
    },

    speedUp: function () {
        this.playerSpeed = 250;
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

    enemyCollision: function () {
        this.burn();
    },

    addEasyEnemy: function (x, y) {
        var staticEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'easy-enemy');
        game.physics.arcade.enable(staticEnemy);
        staticEnemy.body.collideWorldBounds = true;
        this.easyEnemies.add(staticEnemy);
    },

    addNormalEnemy: function (x, y) {
        var movingEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'normal-enemy');
        game.physics.arcade.enable(movingEnemy);
        movingEnemy.body.collideWorldBounds = true;
        this.normalEnemies.add(movingEnemy);
    },

    addStrongEnemy: function (x, y) {
        var strongEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'hard-enemy');
        game.physics.arcade.enable(strongEnemy);
        strongEnemy.body.collideWorldBounds = true;
        this.hardEnemies.add(strongEnemy);
    },

    normalEnemyMove: function () {
        this.normalEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
        });
    },

    hardEnemyMove: function () {
        this.hardEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
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

    detonateBomb: function (x, y, explosionList, wallList, brickList, treasureList) {
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

            temp = treasureList.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (element.x == fire[i].x && element.y == fire[i].y) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                mainState.addCoco(element.x / mainState.PIXEL_SIZE, element.y / mainState.PIXEL_SIZE);
                element.kill();
            })


            //zabijanie latwych przeciwnikow
            temp = this.mainState.easyEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });

            //zabijanie normalnych przeciwnikow
            temp = this.mainState.normalEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });


            //zabijanie trudnych przeciwnikow
            temp = this.mainState.hardEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
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
        var treasureList;

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
            treasureList = this.treasureList;

            setTimeout(function () {
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList, wallList, brickList, treasureList);
                mainState.enablePlayerBomb(1);
            }, 1000);

            setTimeout(this.thisEnableBomb, 2000);
        }

    },

    enablePlayerBomb: function () {
        this.playerDrop = true;
    },
};


//                  DRUGI LEVEL  !!!!!!!!!!!!




var secondLevel = {
    preload: function () {
        // Map sprites
        game.load.image('treasure', 'assets/skrzynia2.png');
        game.load.image('innerwall', 'assets/duzo.png');
        game.load.image('wall', 'assets/duzo.png');
        game.load.image('brick', 'assets/stone.png');
        game.load.image('background', 'assets/sand2.jpg');
        game.load.image('game-over', 'assets/game-over.jpg')

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/eksplozja.png');

        // Player sprites
        game.load.image('bomber', 'assets/postac/postac-front.png');
        game.load.image('bomber-front', 'assets/postac/postac-front.png');
        game.load.image('bomber-left', 'assets/postac/postac-left.png');
        game.load.image('bomber-right', 'assets/postac/postac-right.png');
        game.load.image('bomber-back', 'assets/postac/postac-back.png');

        // Power up sprites
        game.load.image('boots', 'assets/pineapple.png');
        game.load.image('star', 'assets/banana.png');

        //going to next level sprites		
        game.load.image('coco', 'assets/coins.png');
        game.load.image('portal', 'assets/portal.png');

        //enemy sprites		
        game.load.image('easy-enemy', 'assets/tiger.png');
        game.load.image('normal-enemy', 'assets/monkey.png');
        game.load.image('hard-enemy', 'assets/parrot.png');
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
        this.treasureList = game.add.group();
        this.cocoCollectionList = game.add.group();
        this.easyEnemies = game.add.group();
        this.normalEnemies = game.add.group();
        this.hardEnemies = game.add.group();
        this.portalList = game.add.group();

        this.addPlayers();
        this.createMap();

        this.cocoAmount = 5;

        //timer dla wrogow		
        timer = game.time.create(false);
        timer.loop(1000, this.resetTimer, this);
        timer.start();

        // this.addNormalEnemy(1, 6);
        // this.addStrongEnemy(2, 5);

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

    render: function() {
        game.debug.text("Zebrane kokosy: " + this.cocoAmount, 20, 30, "#006400", "bold 20px Arial");
    },

    resetTimer: function () {
        enemyCanRun = true;
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

        if (enemyCanRun) {
            enemyCanRun = false;
            this.normalEnemyMove();
            this.hardEnemyMove();
        }

        game.physics.arcade.collide(this.player, this.treasureList);
        game.physics.arcade.collide(this.player, this.cocoCollectionList, this.collectCoco, null, this)
        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.overlap(this.player, this.explosionList, this.burn, null, this);
        game.physics.arcade.overlap(this.player, this.bootList, this.speedUp, null, this);
        game.physics.arcade.overlap(this.player, this.starList, this.starUp, null, this);
        game.physics.arcade.overlap(this.player, this.easyEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.normalEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.hardEnemies, this.enemyCollision, null, this);

        this.normalEnemies.forEach(function (enemy) {
            game.physics.arcade.collide(enemy, this.secondLevel.wallList);
            game.physics.arcade.collide(enemy, this.secondLevel.brickList);
        });

        game.physics.arcade.overlap(this.player, this.portalList, this.nextLevel, null, this);

        game.physics.arcade.collide(this.player, this.portalList);
    },

    createMap: function () {
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1) {
                    this.addWall(x, y);
                } else if (x % 2 === 0 && y % 2 === 0) {
                    this.addInnerWall(x, y);
                }
            }
        }
        this.addBrick(1, 3), this.addBrick(1, 4), this.addBrick(1, 10), this.addBrick(1, 11);
        this.addBrick(2, 3), this.addBrick(2, 7);
        this.addBrick(3, 1), this.addBrick(3, 4), this.addBrick(3, 5), this.addBrick(3, 10), this.addBrick(3, 11);
        this.addBrick(4, 3), this.addBrick(4, 5);
        this.addBrick(5, 4), this.addBrick(5, 5), this.addBrick(5, 9), this.addBrick(5, 10), this.addBrick(5, 12), this.addBrick(5, 13);
        this.addBrick(6, 1), this.addBrick(6, 3), this.addBrick(6, 5), this.addBrick(6, 7), this.addBrick(6, 9), this.addBrick(6, 13);
        this.addBrick(7, 1), this.addBrick(7, 2), this.addBrick(7, 3), this.addBrick(7, 5), this.addBrick(7, 6), this.addBrick(7, 8), this.addBrick(7, 9), this.addBrick(7, 13);
        this.addBrick(8, 7), this.addBrick(8, 9), this.addBrick(8, 13);
        this.addBrick(9, 1), this.addBrick(9, 2), this.addBrick(9, 3), this.addBrick(9, 9), this.addBrick(9, 13);
        this.addBrick(10, 3), this.addBrick(10, 9), this.addBrick(10, 11), this.addBrick(10, 13);
        this.addBrick(11, 2), this.addBrick(11, 3), this.addBrick(11, 4), this.addBrick(11, 5), this.addBrick(11, 6), this.addBrick(11, 7), this.addBrick(11, 8), this.addBrick(11, 9), this.addBrick(11, 10);
        this.addBrick(12, 1), this.addBrick(12, 5), this.addBrick(12, 11), this.addBrick(12, 13);
        this.addBrick(13, 4), this.addBrick(13, 5), this.addBrick(13, 6);
        this.addPortal(7, 7);
        this.addBoots(11, 1);
        this.addStar(2, 11);
        this.addTreasure(8, 1), this.addTreasure(8, 5), this.addTreasure(12, 7), this.addTreasure(3, 12), this.addTreasure(7, 12);
    },

    addTreasure: function (x, y) {
        var treasure = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'treasure');
        game.physics.arcade.enable(treasure);
        treasure.body.immovable = true;
        this.treasureList.add(treasure);
    },

    burn: function () {
        this.player.kill();
        this.playerDrop = false;
        this.gameOver();
    },

    addCoco: function (x, y) {
        var coco = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'coco');
        game.physics.arcade.enable(coco);
        coco.body.immovable = true;
        this.cocoCollectionList.add(coco);
    },

    collectCoco: function () {
        this.cocoCollectionList.forEach(function (element) {
            element.kill();
        });
        this.cocoAmount++;
        console.log("Liczba kokosów: " + this.cocoAmount);
    },

    addPortal: function (x, y) {
        var portal = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'portal');
        game.physics.arcade.enable(portal);
        portal.body.immovable = true;
        this.portalList.add(portal);
    },

    nextLevel: function () {
        if (this.cocoAmount >= 5) {
            this.portalList.forEach(function (element) {
                element.kill();
                game.state.start('lvl3');
            })
        }
    },

    gameOver: function () {
        game.add.image(0, 0, 'game-over');
    },

    speedUp: function () {
        this.playerSpeed = 250;
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

    enemyCollision: function () {
        this.burn();
    },

    addEasyEnemy: function (x, y) {
        var staticEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'easy-enemy');
        game.physics.arcade.enable(staticEnemy);
        staticEnemy.body.collideWorldBounds = true;
        this.easyEnemies.add(staticEnemy);
    },

    addNormalEnemy: function (x, y) {
        var movingEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'normal-enemy');
        game.physics.arcade.enable(movingEnemy);
        movingEnemy.body.collideWorldBounds = true;
        this.normalEnemies.add(movingEnemy);
    },

    addStrongEnemy: function (x, y) {
        var strongEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'hard-enemy');
        game.physics.arcade.enable(strongEnemy);
        strongEnemy.body.collideWorldBounds = true;
        this.hardEnemies.add(strongEnemy);
    },

    normalEnemyMove: function () {
        this.normalEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
        });
    },

    hardEnemyMove: function () {
        this.hardEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
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

    detonateBomb: function (x, y, explosionList, wallList, brickList, treasureList) {
        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];

        if (secondLevel.playerPower) {
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

            temp = treasureList.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (element.x == fire[i].x && element.y == fire[i].y) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                secondLevel.addCoco(element.x / secondLevel.PIXEL_SIZE, element.y / secondLevel.PIXEL_SIZE);
                element.kill();
            })

            //zabijanie latwych przeciwnikow
            temp = this.secondLevel.easyEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });

            //zabijanie normalnych przeciwnikow
            temp = this.secondLevel.normalEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });


            //zabijanie trudnych przeciwnikow
            temp = this.secondLevel.hardEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
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
        var treasureList;

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
            treasureList = this.treasureList;

            setTimeout(function () {
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList, wallList, brickList, treasureList);
                secondLevel.enablePlayerBomb(2);
            }, 1000);

            setTimeout(this.thisEnableBomb, 2000);
        }

    },

    enablePlayerBomb: function () {
        this.playerDrop = true;
    }
}


//              TRZECI LEVEL !!!!!!!!



var thirdLevel = {
    preload: function () {
        // Map sprites
        game.load.image('treasure', 'assets/skrzynia2.png');
        game.load.image('innerwall', 'assets/christmas-tree.png');
        game.load.image('wall', 'assets/christmas-tree.png');
        game.load.image('brick', 'assets/deer.png');
        game.load.image('background', 'assets/snow.jpg');
        game.load.image('game-over', 'assets/game-over.jpg');
        game.load.image('finish', 'assets/finish.jpg');

        // Weapon sprites
        game.load.image('bomb', 'assets/bauble.png');
        game.load.image('explosion', 'assets/eksplozja2.png');

        // Player sprites
        game.load.image('bomber', 'assets/postac/postac-front.png');
        game.load.image('bomber-front', 'assets/postac/postac-front.png');
        game.load.image('bomber-left', 'assets/postac/postac-left.png');
        game.load.image('bomber-right', 'assets/postac/postac-right.png');
        game.load.image('bomber-back', 'assets/postac/postac-back.png');

        // Power up sprites
        game.load.image('boots', 'assets/candy-cane.png');
        game.load.image('star', 'assets/gingerbread-man.png');

        //going to next level sprites		
        game.load.image('coco', 'assets/icecream.png');
        game.load.image('portal', 'assets/portal.png');

        //enemy sprites		
        game.load.image('easy-enemy', 'assets/snowman.png');
        game.load.image('normal-enemy', 'assets/snowman2.png');
        game.load.image('hard-enemy', 'assets/snowman3.png');
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
        this.treasureList = game.add.group();
        this.cocoCollectionList = game.add.group();
        this.easyEnemies = game.add.group();
        this.normalEnemies = game.add.group();
        this.hardEnemies = game.add.group();
        this.portalList = game.add.group();

        this.addPlayers();
        this.createMap();

        this.cocoAmount = 0;

        //timer dla wrogow		
        timer = game.time.create(false);
        timer.loop(1000, this.resetTimer, this);
        timer.start();


        this.addNormalEnemy(1, 6);
        this.addStrongEnemy(2, 5);

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

    render: function() {
        game.debug.text("Zebrane kokosy: " + this.cocoAmount, 20, 30, "#B22222", "bold 20px Arial");
    },


    resetTimer: function () {
        enemyCanRun = true;
    },

    addTreasure: function (x, y) {
        var treasure = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'treasure');
        game.physics.arcade.enable(treasure);
        treasure.body.immovable = true;
        this.treasureList.add(treasure);
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

        if (enemyCanRun) {
            enemyCanRun = false;
            this.normalEnemyMove();
            this.hardEnemyMove();
        }

        game.physics.arcade.collide(this.player, this.treasureList);
        game.physics.arcade.collide(this.player, this.cocoCollectionList, this.collectCoco, null, this)
        game.physics.arcade.collide(this.player, this.wallList);
        game.physics.arcade.collide(this.player, this.brickList);
        game.physics.arcade.overlap(this.player, this.explosionList, this.burn, null, this);
        game.physics.arcade.overlap(this.player, this.bootList, this.speedUp, null, this);
        game.physics.arcade.overlap(this.player, this.starList, this.starUp, null, this);
        game.physics.arcade.overlap(this.player, this.easyEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.normalEnemies, this.enemyCollision, null, this);
        game.physics.arcade.overlap(this.player, this.hardEnemies, this.enemyCollision, null, this);

        this.normalEnemies.forEach(function (enemy) {
            game.physics.arcade.collide(enemy, this.thirdLevel.wallList);
            game.physics.arcade.collide(enemy, this.thirdLevel.brickList);
        });

        game.physics.arcade.overlap(this.player, this.portalList, this.nextLevel, null, this);

        game.physics.arcade.collide(this.player, this.portalList);
    },

    enemycollide: function (enemy) {
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
    },

    createMap: function () {
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1) {
                    this.addWall(x, y);
                } else if (x % 2 === 0 && y % 2 === 0) {
                    this.addInnerWall(x, y);
                }
            }
        }
        this.addBrick(1, 3), this.addBrick(1, 4), this.addBrick(1, 10), this.addBrick(1, 11);
        this.addBrick(2, 3), this.addBrick(2, 7);
        this.addBrick(3, 1), this.addBrick(3, 4), this.addBrick(3, 5), this.addBrick(3, 10), this.addBrick(3, 11);
        this.addBrick(4, 3), this.addBrick(4, 5);
        this.addBrick(5, 4), this.addBrick(5, 5), this.addBrick(5, 9), this.addBrick(5, 10), this.addBrick(5, 12), this.addBrick(5, 13);
        this.addBrick(6, 1), this.addBrick(6, 3), this.addBrick(6, 5), this.addBrick(6, 7), this.addBrick(6, 9), this.addBrick(6, 13);
        this.addBrick(7, 1), this.addBrick(7, 2), this.addBrick(7, 3), this.addBrick(7, 5), this.addBrick(7, 6), this.addBrick(7, 8), this.addBrick(7, 9), this.addBrick(7, 13);
        this.addBrick(8, 7), this.addBrick(8, 9), this.addBrick(8, 13);
        this.addBrick(9, 1), this.addBrick(9, 2), this.addBrick(9, 3), this.addBrick(9, 9), this.addBrick(9, 13);
        this.addBrick(10, 3), this.addBrick(10, 9), this.addBrick(10, 11), this.addBrick(10, 13);
        this.addBrick(11, 2), this.addBrick(11, 3), this.addBrick(11, 4), this.addBrick(11, 5), this.addBrick(11, 6), this.addBrick(11, 7), this.addBrick(11, 8), this.addBrick(11, 9), this.addBrick(11, 10);
        this.addBrick(12, 1), this.addBrick(12, 5), this.addBrick(12, 11), this.addBrick(12, 13);
        this.addBrick(13, 4), this.addBrick(13, 5), this.addBrick(13, 6);
        this.addPortal(7, 7);
        this.addBoots(11, 1);
        this.addStar(2, 11);
        this.addTreasure(8, 1), this.addTreasure(8, 5), this.addTreasure(12, 7), this.addTreasure(3, 12), this.addTreasure(7, 12);
    },

    burn: function () {
        this.player.kill();
        this.playerDrop = false;
        this.gameOver();
    },

    addTreasure: function (x, y) {
        var treasure = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'treasure');
        game.physics.arcade.enable(treasure);
        treasure.body.immovable = true;
        this.treasureList.add(treasure);
    },

    addCoco: function (x, y) {
        var coco = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'coco');
        game.physics.arcade.enable(coco);
        coco.body.immovable = true;
        this.cocoCollectionList.add(coco);
    },

    collectCoco: function () {
        this.cocoCollectionList.forEach(function (element) {
            element.kill();
        });
        this.cocoAmount++;
        console.log("Liczba kokosów: " + this.cocoAmount);
    },

    addPortal: function (x, y) {
        var portal = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'portal');
        game.physics.arcade.enable(portal);
        portal.body.immovable = true;
        this.portalList.add(portal);
    },

    finish: function () {
        game.add.image(0, 0, 'finish');
    },

    nextLevel: function () {
        if (this.cocoAmount >= 5) {
            this.finish();
        }
    },

    gameOver: function () {
        game.add.image(0, 0, 'game-over');
    },

    speedUp: function () {
        this.playerSpeed = 250;
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

    enemyCollision: function () {
        this.burn();
    },

    addEasyEnemy: function (x, y) {
        var staticEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'easy-enemy');
        game.physics.arcade.enable(staticEnemy);
        staticEnemy.body.collideWorldBounds = true;
        this.easyEnemies.add(staticEnemy);
    },

    addNormalEnemy: function (x, y) {
        var movingEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'normal-enemy');
        game.physics.arcade.enable(movingEnemy);
        movingEnemy.body.collideWorldBounds = true;
        this.normalEnemies.add(movingEnemy);
    },

    addStrongEnemy: function (x, y) {
        var strongEnemy = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'hard-enemy');
        game.physics.arcade.enable(strongEnemy);
        strongEnemy.body.collideWorldBounds = true;
        this.hardEnemies.add(strongEnemy);
    },

    normalEnemyMove: function () {
        this.normalEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
        });
    },

    hardEnemyMove: function () {
        this.hardEnemies.forEach(function (enemy) {
            var direction = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

            switch (direction) {
                case 0:
                    enemy.body.velocity.y = -(enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 1:
                    enemy.body.velocity.x = (enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
                case 2:
                    enemy.body.velocity.y = (enemySpeed);
                    enemy.body.velocity.x = 0;
                    break;
                case 3:
                    enemy.body.velocity.x = -(enemySpeed);
                    enemy.body.velocity.y = 0;
                    break;
            }
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

    detonateBomb: function (x, y, explosionList, wallList, brickList, treasureList) {
        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];

        if (thirdLevel.playerPower) {
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

            temp = treasureList.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (element.x == fire[i].x && element.y == fire[i].y) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                thirdLevel.addCoco(element.x / thirdLevel.PIXEL_SIZE, element.y / thirdLevel.PIXEL_SIZE);
                element.kill();
            })

            //zabijanie latwych przeciwnikow
            temp = this.thirdLevel.easyEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });

            //zabijanie normalnych przeciwnikow
            temp = this.thirdLevel.normalEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function (element) {
                element.kill();
            });


            //zabijanie trudnych przeciwnikow
            temp = this.thirdLevel.hardEnemies.filter(function (element) {
                for (var i = 0; i < fire.length; i++) {
                    if (Math.abs(element.x - fire[i].x) < 40 && Math.abs(element.y - fire[i].y) < 40) {
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
        var treasureList;

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
            treasureList = this.treasureList;

            setTimeout(function () {
                bomb.kill();
                detonateBomb(bomb.x, bomb.y, explosionList, wallList, brickList, treasureList);
                thirdLevel.enablePlayerBomb(3);
            }, 1000);

            setTimeout(this.thisEnableBomb, 2000);
        }

    },

    enablePlayerBomb: function () {
        this.playerDrop = true;
    }
}

var GAME_SIZE = 600;
var gameInPlay = true;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.add('lvl2', secondLevel);
game.state.add('lvl3', thirdLevel);
game.state.start('main');
var enemySpeed = 100;
var timer;
var i = 0;
var enemyCanRun = true;