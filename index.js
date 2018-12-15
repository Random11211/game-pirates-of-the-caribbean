var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 500 },
          debug: false
        }
      },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var logo;
var speed = 50;
var emitter;

var cursor;
var mapa, layer1, palmy;

function preload()
{
    this.load.image('logo', 'items/bomb2.png');
    this.load.tilemapTiledJSON('mapa', 'mapa.json');
    this.load.image('tiles', 'plansza/plaza.png');
    this.load.image('palma', 'plansza/palma.png');
}

var player;
var cursors;

function create()
{
    // this.add.image(400, 300, 'background');
    this.map = this.make.tilemap({ key: 'mapa'});
    let tileset = this.map.addTilesetImage('plaza', 'tiles');
    layer1 = this.map.createStaticLayer('poziom1', tileset);
    // layer1.resizeWorld();
    console.log(this.map.layers[0].data);
    console.log(layer1);
    
    //zrobić na layer1 -> jest tablica dwuwymiarowa 16x16 , a wymiary tile w pixelach 50x50
    palmy = this.physics.add.staticGroup();
    palmy.create(1, 2, 'palma');
    palmy.create(5, 5, 'palma');
    // palmy.create(400, 140, 'platform');
    // palmy.create(450, 90, 'platform');
    // palmy.create(500, 140, 'platform');
    // palmy.create(600, 190, 'platform');
    // palmy.create(700, 240, 'platform');
    palmy.getChildren().forEach(c => c.setScale(0.1).setOrigin(0).refreshBody())
    // this.physics.add.collider(player, palmy);

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