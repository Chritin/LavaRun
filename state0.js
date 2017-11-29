//create variable cursors
var demo = {};
var kevon;
var cursors;

demo.state0 = function () {};


demo.state0.prototype = {
	preload: function(){
		game.load.image();
        game.load.spritesheet();
	},

	create: function(){
        game.world.setBounds();
      //add physics to game
        game.physics.startSystem();
      // adding gravity to adam
        var tree = game.add.sprite();
        adam = game.add.sprite();
        game.physics.enable(adam);
        .body.gravity.y = ;
        .body.collideWorldBounds = true
        .scale.setTo();
        .animations.add()
      // creating cursor keys: lets you press buttons for your avatar to move
        cursors = game.input.keyboard.createCursorKeys();
	},

	update: function(){
        if(cursors.right.isDown)
            {
                .body.velocity.x = 150;
                .animations.play('walk');
            } else if(cursors.left.isDown){
                .body.velocity.x = -150;
                 .animations.play('walk');

            }else { 
                .body.velocity.x = 0;
                .animations.stop();
                .frame = 0;
            }
        if(cursors.up.isDown){
            .body.velocity.y = -200;
        }
        
	}

};