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

var game = new Phaser.Game(config);
var logo;
var speed = 5;
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

    var particles = this.add.particles('red');

    emitter = particles.createEmitter({
        speed: 10,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    //logo = this.physics.add.sprite(100, 50, 'logo');

    //controls = {
    //    right : game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    //    left : game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    //    up : game.input.keyboard.addKey(Phaser.Keyboard.UP),       
    //};

    //logo.setVelocity(20, 20);
    //logo.setBounce(0.9, 1.1);
    //logo.setCollideWorldBounds(true);

    //emitter.startFollow(logo);
}

function update() {
    //if (controls.right.isDown) {
    //    logo.x += speed;
    //}
    // if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    //     logo.x += speed;
    // }
    // else if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    //     logo.x -= speed;
    // }
}