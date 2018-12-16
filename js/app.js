var scoreBoard = document.querySelectorAll(".score");

var position = document.querySelectorAll(".pos");

var mainState = {
    preload: function(){
        // Map sprites
        game.load.image('ground', 'assets/bush.png');
        // game.load.image('grass', 'plansza/bush.png');
        game.load.image('innerwall', 'assets/wall.png');
        game.load.image('wall', 'assets/palma.png');
        game.load.image('brick', 'assets/flamingo.png');
        game.load.image('blue-flag', 'assets/blue-flag.png');
        game.load.image('red-flag', 'assets/red-flag.png');

        // Weapon sprites
        game.load.image('bomb', 'assets/bomb.png');
        game.load.image('explosion', 'assets/eksplozja.png');

        // Player sprites
        game.load.image('bomber', 'assets/bomber.png');
        game.load.image('bomber-front', 'assets/bomber-front.png');
        game.load.image('bomber-left', 'assets/bomber-left.png');
        game.load.image('bomber-right', 'assets/bomber-right.png');
        game.load.image('bomber-back', 'assets/bomber-back.png');

        // Button sprites
        game.load.image('next-round', 'assets/next-round.png');
        game.load.image('start-game', 'assets/start-game.png');
        game.load.image('play-again', 'assets/play-again.png');
        
        // Power up sprites
        game.load.image('boots', 'assets/lemon.png');
        game.load.image('star', 'assets/strawberry.png');

        //other sprites
        game.load.image('background', 'assets/b22.jpg');
    },

    create: function(){
        this.BLOCK_COUNT = 15;
        this.PIXEL_SIZE = GAME_SIZE / this.BLOCK_COUNT;

        game.add.image(0, 0, 'background');
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;

        // Group container of game sprites
        // this.grassList = game.add.group();
        this.wallList = game.add.group();
        this.bootList = game.add.group();
        this.starList = game.add.group();
        this.brickList = game.add.group();
        this.bombList = game.add.group();
        this.flagList = game.add.group();
        this.addPlayers();
        this.explosionList = game.add.group();


        // Adds walls, bricks and powerups
        this.createMap();

        // Players 1's intial properties
        this.playerSpeed = 150;
        this.playerPower = false;
        this.playerDrop = true;

        // Creates listeners for player 1's controls
        this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // Creates game feedback message
        this.gameMessage = "";
        this.messageStyle = { font: "60px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};
        this.infoStyle = { font: "30px Arcade", fill: "#FFFFFF", boundsAlignV: "middle", boundsAlignH: "center", align: "center", wordWrapWidth: 600};

        // Shows splash screen
        if(!gameInPlay){
            this.showRoundWinner(null);
        }
    },

    update: function(){

        if (this.aKey.isDown || this.sKey.isDown || this.dKey.isDown || this.wKey.isDown){
            if (this.aKey.isDown){
                this.player.body.velocity.x = -(this.playerSpeed);
                this.player.loadTexture('bomber-left', 0);
            }
            if (this.dKey.isDown){
                this.player.body.velocity.x = (this.playerSpeed);
                this.player.loadTexture('bomber-right', 0);
            }
            if (this.wKey.isDown){
                this.player.body.velocity.y = -(this.playerSpeed);
                this.player.loadTexture('bomber-back', 0);
            }
            if (this.sKey.isDown){
                this.player.body.velocity.y = (this.playerSpeed);
                this.player.loadTexture('bomber-front', 0);
            }
        } 
        else{
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        if (this.spaceKey.justUp){
            if(gameInPlay)
                this.dropBomb(1);
        }

        game.physics.arcade.collide(this.player, this.wallList);
        // game.physics.arcade.collide(this.player, this.brickList);
        // game.physics.arcade.overlap(this.player, this.explosionList, function(){this.burn(1);}, null, this);
        // game.physics.arcade.overlap(this.explosionList, this.flagList.children[0], function(){this.getFlag(1);}, null, this);
        // game.physics.arcade.overlap(this.player, this.bootList, function(){this.speedUp(1);}, null, this);
        // game.physics.arcade.overlap(this.player, this.starList, function(){this.starUp(1);}, null, this);

        $(".pos").html("X: " + this.player.x + " Y: " + this.player.y);
        var x = this.player.x - this.player.x % this.PIXEL_SIZE;
        var y = this.player.y - this.player.y % this.PIXEL_SIZE;
        var div = Math.trunc(this.player.x/ this.PIXEL_SIZE);
        //$(".bomb").html("X: " + x + " Y: " + y);
        $(".bomb").html(this.PIXEL_SIZE);
    },

    getBombCords: function() {

    },

    createMap: function(){
        for (var x = 0; x < this.BLOCK_COUNT; x++) {
            for (var y = 0; y < this.BLOCK_COUNT; y++) {
                if( x == 1 && x == y){
                    this.addBlueFlag();
                    this.addRedFlag();
                }
                if (x === 0 || y === 0 || x == this.BLOCK_COUNT - 1 || y == this.BLOCK_COUNT - 1){
                    this.addWall(x, y);
                }
                else if(x % 2 === 0 && y % 2 === 0){
                    this.addInnerWall(x, y);
                } else {
                    if(Math.floor(Math.random() * 3)){
                        this.addBrick(x, y);
                        if(Math.floor(Math.random() * 1.02)){
                            this.addBoots(x, y);
                        }
                        if(Math.floor(Math.random() * 1.02)){
                            this.addStar(x, y);
                        }
                    // } else {
                    //     this.addGrass(x, y);
                    }
                }
            }
        }
    },

    burn: function(player){
        if(player == 1){
             this.player.kill();
         } else {
             this.player_2.kill();
        }

        // if(gameInPlay){
        //     var score = Number(scoreBoard[player - 1].innerText);
        //     scoreBoard[player - 1].innerText = score + 1;

        //     if(score + 1 === 5){
        //         this.showGameWinner(player);
        //         winner.play();
        //     } else {
        //         this.showRoundWinner(player);
        //         roundEnd.play();
        //     }
        // }

        // gameInPlay = false;
    },

    getFlag: function(player){

        // if(gameInPlay){
        //     var score = Number(scoreBoard[player - 1].innerText);
        //     scoreBoard[player - 1].innerText = score + 1;

        //     if(score + 1 === 5){
        //         this.showGameWinner(player);
        //     } else {
        //         this.showRoundWinner(player);
        //     }
        // }

        // gameInPlay = false;
    },

    speedUp: function(player){
        this.playerSpeed = 350;

        this.bootList.forEach(function(element){
            element.kill();
        });
    },

    addBoots: function(x, y){
        var boots = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'boots');
        game.physics.arcade.enable(boots);
        boots.body.immovable = true;
        this.bootList.add(boots);
    },

    starUp: function(player){
        this.playerPower = true;

        this.starList.forEach(function(element){
            element.kill();
        });
    },

    addStar: function(x, y){
        var star = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'star');
        game.physics.arcade.enable(star);
        star.body.immovable = true;
        this.starList.add(star);
    },

    addPlayers: function(){

        this.player = game.add.sprite(1 * this.PIXEL_SIZE, 1 * this.PIXEL_SIZE, 'bomber');
        game.physics.arcade.enable(this.player);
    },

    addBlueFlag: function(){
        var blueFlag = game.add.sprite(1 * this.PIXEL_SIZE, 1 * this.PIXEL_SIZE, 'blue-flag');
        game.physics.arcade.enable(blueFlag);
        blueFlag.body.immovable = true;
        this.flagList.add(blueFlag);

    },

    addRedFlag: function(){
        var redFlag = game.add.sprite((this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, (this.BLOCK_COUNT - 2) * this.PIXEL_SIZE, 'red-flag');
        game.physics.arcade.enable(redFlag);
        redFlag.body.immovable = true;
        this.flagList.add(redFlag);

    },

    addWall: function(x, y){
        var wall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'wall');
        game.physics.arcade.enable(wall);
        wall.body.immovable = true;
        this.wallList.add(wall);

    },

    addInnerWall: function(x, y) {
        var innerwall = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'innerwall');
        game.physics.arcade.enable(innerwall);
        innerwall.body.immovable = true;
        this.wallList.add(innerwall);
    },

    addBrick: function(x, y){
        var brick = game.add.sprite(x * this.PIXEL_SIZE, y * this.PIXEL_SIZE, 'brick');
        game.physics.arcade.enable(brick);
        brick.body.immovable = true;
        this.brickList.add(brick);

    },

    detonateBomb: function(player, x, y, explosionList, wallList, brickList){
        var fire = [
            game.add.sprite(x, y, 'explosion'),
            game.add.sprite(x, y + 40, 'explosion'),
            game.add.sprite(x, y - 40, 'explosion'),
            game.add.sprite(x + 40, y, 'explosion'),
            game.add.sprite(x - 40, y, 'explosion')
        ];
        if(player == 1 && mainState.playerPower){
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
            if(game.physics.arcade.overlap(fire[i], wallList)){
                fire[i].kill();
                if(i > 0 && fire[i + 4] !== undefined){
                    fire[i + 4].kill();
                }
            }
        }

        setTimeout(function(){
            explosionList.forEach(function(element){
                element.kill();
            });
            var temp = brickList.filter(function(element){
                for (var i = 0; i < fire.length; i++) {
                    if(element.x == fire[i].x && element.y == fire[i].y){
                        return true;
                    }
                }
                return false;
            });

            temp.list.forEach(function(element){
                element.kill();
            });
        }, 1000);
    },

    dropBomb: function(player){
        var gridX;
        var gridY;
        var bomb;
        var detonateBomb;
        var explosionList;
        var wallList;
        var brickList;

        if(player == 1  && this.playerDrop){
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

            setTimeout(function(){
                bomb.kill();
                detonateBomb(player, bomb.x, bomb.y, explosionList, wallList, brickList);
                mainState.enablePlayerBomb(1);
            }, 2000);

            setTimeout(this.thisEnableBomb, 2000);
        }

    },

    enablePlayerBomb: function(player){
        this.playerDrop = true;
    },

    showRoundWinner: function(player){

        if(player !== null){
            this.gameMessage = game.add.text(0, 0, "PLAYER " + player + " WINS", this.messageStyle);
            this.gameMessage.setTextBounds(0, 0, 600, 560);
            this.button = game.add.button(230, 300, 'next-round');
        } else{
            // this.background = game.add.tileSprite(40, 40, 520, 520, 'grass');
            var introString = "LET'S PLAY BOMBERMAN" + "\n";
                introString += "You are in a mission to take control" + "\n";
                introString += "of you opponents base. Drop bombs" + "\n";
                introString += "to destroy the walls and navigate" + "\n";
                introString += "through the field." + "\n";

            this.gameMessage = game.add.text(0, 0, introString, this.infoStyle);
            this.gameMessage.setTextBounds(0, 0, 600, 560);
            this.button = game.add.button(230, 350, 'start-game');
        }

        this.button.onInputUp.add(this.restartGame, this);
    },

    showGameWinner: function(player){

        this.gameMessage = game.add.text(0, 0, "GAME OVER!\nPLAYER " + player + " WINS", this.messageStyle);
        this.gameMessage.setTextBounds(0, 0, 600, 560);
        this.button = game.add.button(230, 350, 'play-again');

        this.button.onInputUp.add(function(){
            scoreBoard[0].innerText = 0;
            scoreBoard[1].innerText = 0;
            this.restartGame();
        }, this);
    },

    restartGame: function(){
        gameInPlay = true;
        game.state.start('main');
    }

};

var GAME_SIZE = 600;
var gameInPlay = false;
var game = new Phaser.Game(GAME_SIZE, GAME_SIZE);
game.state.add('main', mainState);
game.state.start('main');
