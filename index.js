var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var logo;
var speed = 50;
var emitter;

var cursor;
var mapa, layer1;

function preload()
{
    this.load.image('logo', 'items/coins.png');
    this.load.image('background', '/plansza/plaza.jpg');
    this.load.tilemapTiledJSON('mapa', 'mapa.json');
    this.load.image('tiles', 'plansza/plaza.png');
    this.load.spritesheet('dude', 'items/bomb2.png', { frameWidth: 32, frameHeight: 48 });
}

var player;
var cursors;

function create()
{
    game.add.image(0, 0, 'tiles');
    
    //this.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.8;

    player = this.add.sprite(32, game.world.height - 150, 'logo');

    game.physics.p2.enable(player);
    player.body.setZeroDamping();
    player.body.fixedRotation = true;

    text = game.add.text(20, 20, 'move with arrow keys', { fill: '#ffffff' });

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    if (cursors.right.isDown) {
        player.body.moveRight(speed);
    }
    else if (cursors.left.isDown) {
        player.body.moveLeft(speed);
    }

    if (cursors.up.isDown) {
        player.body.moveUp(speed);
    }
    else if (cursors.down.isDown) {
        player.body.moveDown(speed);
    }
    
}

function render() {
    
}