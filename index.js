var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        //update: update,
    }
};

var game = new Phaser.Game(config);

var cursor;

function preload()
{
    this.load.image('logo', 'items/bomb2.png');
    this.load.image('red', 'assets/red.png');
    this.load.image('background', '/plansza/plaza.jpg');
}

function create()
{
    this.add.image(400, 300, 'background');

    //cursor = game.input.keyboard.createCursorKeys();

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 50,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(100, 50, 'logo');

    logo.setVelocity(500, 150);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}

//function update() {
//    logo.body.velocity.x = 100;
//    logo.body.velocity.y = 50;
//}