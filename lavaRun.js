var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/tiles-1.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('background', 'assets/background2.png');
    game.load.spritesheet('banana', 'assets/banana.png', 33, 56);
    game.load.spritesheet('lava', 'assets/final_lava.png', 112, 96);
    game.load.spritesheet('enemy', 'assets/droid.png', 32,32);
    game.load.audio('boop','assets/boop.wav');
    game.load.audio('song', 'assets/song2.mp3');
    game.load.spritesheet('player', 'assets/complete_sprite.png', 70, 70);

//    game.load.image('banana', 'assets/star.png');

}

var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var bananas;
var lava;
var enemies; 

var score = 100;
var scoreText; 
var lavaDelayTracker = 0;
var scoreDelayTracker = 0;
var position = -100;
var bananaCount = 0;

var monkey;

var resultText;
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    map = game.add.tilemap('level1');

    map.addTilesetImage('tiles-1');

    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
//     layer.debug = true;

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;

//    player = game.add.sprite(32, 32, 'dude');
//    game.physics.enable(player, Phaser.Physics.ARCADE);
//
//    player.body.bounce.y = 0.2;
//    player.body.collideWorldBounds = true;
//    player.body.setSize(20, 32, 5, 16);
//
//    player.animations.add('left', [0, 1, 2, 3], 10, true);
//    player.animations.add('turn', [4], 20, true);
//    player.animations.add('right', [5, 6, 7, 8], 10, true);
    
    monkey = game.add.sprite(30, 32, 'player');
    game.physics.enable(monkey, Phaser.Physics.ARCADE);
    
    monkey.body.bounce.y = 0.2;
    monkey.body.collideWorldBounds = true;
    monkey.body.setSize(20, 32, 5, 16);
    
    monkey.animations.add('left', [2,3,4,5,6,7,8,9], 3, false);
    monkey.animations.add('right', [10, 11, 12, 13, 14], 4, false);
    
    bananas = game.add.group();
    bananas.enableBody = true;
    for(var i = 1; i < 30; i++){
        var banana = bananas.create( i * 95, i * 70, 'banana');
        banana.anchor.set(0.5, 0.5);
        banana.scale.setTo(0.5, 0.5);
        game.physics.enable(banana, Phaser.Physics.ARCADE);
        banana.body.allowGravity = true;
        banana.body.gravity.y = 6;
        banana.body.bounce.y = 0.7 + Math.random() * 0.2;
//        banana.animations.add('rotate', [0,1,2,3,4,5], 3, true);
//        banana.animations.play('rotate');
        banana.body.collideWorldBounds = true;
    }
    
    enemies = game.add.group();
    enemies.enableBody = true;
    for(var i = 1; i < 10; i++){
        var enemy = enemies.create(i * 80, i * 70, 'enemy');
        enemy.anchor.set(0.5, 0.5);
//        enemy.scale.setTo(0.8, 0.8);
        game.physics.enable(enemy, Phaser.Physics.ARCADE);
        enemy.body.allowGravity = true;
        enemy.body.gravity.y = 2;
        enemy.body.bounce.y = 0.7 + Math.random() * 0.2;
        enemy.animations.add('crawl', [0,1,2,3], 4, true);
        enemy.animations.play('crawl');
        enemy.body.collideWorldBounds = true;
        
    }
    

//    lava.body.allowGravity = false;
    for(var x = 0; x < game.world.width; x+= 100){
        lava = game.add.sprite(x, 0, 'lava'); //change y position of 
        lava.animations.add('fall', [0,1,2,3,4,5,6], 4, true);
        lava.animations.play('fall');
    }
    



    game.camera.follow(monkey);
//    game.camera.setSize(50,50);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    scoreText = game.add.text(16, 64, 'Score: 100', {fontsize: '32px', fill: '#FFF'});
        game.sound.play('song');


}

function update() {
    
//    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(bananas, layer);
    game.physics.arcade.collide(enemies, layer);
    game.physics.arcade.collide(monkey, layer);
    
    game.physics.arcade.overlap(monkey, bananas, collectBanana, null, this);
    game.physics.arcade.overlap(monkey, enemies,  collideEnemy, null, this);
    
    scoreText.x = game.camera.x;
    scoreText.y = game.camera.y;
    
    monkey.body.velocity.x = 0;
    

    if (cursors.left.isDown)
    {
        monkey.body.velocity.x = -150;

        if (facing != 'left')
        {
            monkey.animations.play('left');

            facing = 'left';
        }
        
    }
    else if (cursors.right.isDown)
    {
        monkey.body.velocity.x = 150;

        if (facing != 'right')
        {
            monkey.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            monkey.animations.stop();

            if (facing == 'left')
            {
                monkey.frame = 1;
            }
            else
            {
                monkey.frame = 0;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && game.time.now > jumpTimer)
    {
        monkey.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

}

function collectBanana(player, banana){
    banana.kill();
    bananaCount = bananaCount + 1;
    
    console.log('bananaCount: ' + bananaCount);
    
    if(score > 400){
        resultText = game.add.text(game.camera.width/2, game.camera.height/2, 'Congratulations, You Win!', {fontsize: '32px', fill: '#FFF'} );
    }
    
    score += 20;
    scoreText.text = 'Score: ' + score;
}


function collideEnemy(player, enemy) {    
    if ( enemy.body.touching.up )    {
        game.sound.play('boop');
        enemy.kill();
        score += 100;
        scoreText.text = 'Score: ' + score;
    } else{
        if(score >= 0){
            score -= 10;
            scoreText.text = 'Score: ' + score;
        }
        else{
            resultText = game.add.text(game.camera.width/2, game.camera.height/2, 'You lose, hit refresh to start again.', {fontsize: '32px', fill: '#FFF'} );
 
        }

    }
}

function render () {

}