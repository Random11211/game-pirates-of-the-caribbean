var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
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
var mapa, layer1;

function preload()
{
    this.load.image('logo', 'items/bomb2.png');
    // this.load.image('background', '/plansza/plaza.jpg');
    this.load.tilemapTiledJSON('mapa', 'mapa.json');
    this.load.image('tiles', 'plansza/plaza.png');
}

function create()
{
    // this.add.image(400, 300, 'background');
    this.map = this.make.tilemap({ key: 'mapa'});
    let tileset = this.map.addTilesetImage('plaza', 'tiles');
    this.map.createStaticLayer('poziom1', tileset);
    //layer1.resizeWorld();

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