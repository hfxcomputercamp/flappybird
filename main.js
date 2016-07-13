// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
var game_state = {};
var score;

// Creates The Starting Menu


// Creates a new 'main' state that wil contain the game
game_state.splash = function() { };
game_state.splash.prototype = {
	preload: function() {
		// Function called first to load all the assets
		this.game.load.image("background", "assets/bg_splash.png");
		this.game.load.image("play", "assets/btn_play.png");
	},

	create: function() {
		// Fuction called after 'preload' to setup the game
		var bgLayer = game.add.group();
		var btnLayer = game.add.group();

		this.bg = bgLayer.create(0, 0, 'background');
		this.btnLayer = bgLayer.create(149, 420, 'play');
		game.add.button(game.world.centerX - 51, 420, 'play', clickPlayBtn, this, 2, 1, 0);
	},
	update: function() {
	}
};

function clickPlayBtn() {
	game.state.start('main');
}

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  
game_state.main.prototype = {
    preload: function() { 
		// Function called first to load all the assets
		this.game.load.image("background", "assets/bg.jpg");
		this.game.load.image('bird', 'assets/bird.png');
		this.game.load.image('birdFlap', 'assets/bird_flap.png');
		this.game.load.image('pipe', 'assets/pipe.png'); 
    },

    create: function() { 
    	// Fuction called after 'preload' to setup the game
		var bgLayer = game.add.group();
		var playerLayer = game.add.group();
		var pipeLayer = game.add.group();

		this.bg = bgLayer.create(0, 0, 'background');
    	this.bird = playerLayer.create(100, 245, 'bird');
    	this.bird.body.gravity.y = 1000;
    	this.pipes = game.add.group();
		this.pipes.createMultiple(20, 'pipe');

		this.score = 0;  
		var style = { font: "30px Arial", fill: "#ffffff" };  
		this.label_score = this.game.add.text(20, 20, "0", style);
		this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);

    	var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	spaceKey.onDown.add(this.jump, this);
    },
    
    update: function() {
		// Function called 60 times per second
		if(!this.bird.inWorld){
			this.gameOver();
		}
		score = this.score;
		this.game.physics.overlap(this.bird, this.pipes, this.gameOver, null, this);
    },

    jump: function(){
    	this.bird.body.velocity.y = -350;
		this.bird.loadTexture('birdFlap');
		if(typeof this.flapTimer != null) {
			this.game.time.events.remove(this.flapTimer);
			this.flapTimer = this.game.time.events.loop(250, this.finishJump, this);
		}
    },

	finishJump: function() {
		this.bird.loadTexture('bird');
	},

    gameOver: function(){
    	this.game.time.events.remove(this.timer);
		this.pipes = null;
    	this.game.state.start('gameOver');

    },

    addOnePipe: function(x,y){
    	var pipe = this.pipes.getFirstDead();

		if(typeof pipe != null) {
			pipe.reset(x, y);
			pipe.body.velocity.x = -200;
			pipe.outOfBoundsKill = true;
		}
    },
    
    add_row_of_pipes: function() {
		var hole = Math.floor(Math.random()*5)+1;

		this.score += 1;
		this.label_score.content = this.score;

		for (var i = 0; i < 8; i++) {
			if (i != hole && i != hole + 1) {
				this.addOnePipe(400, i * 50);
			}
		}
	}	 
};



game_state.gameOver = function() {};
game_state.gameOver.prototype = {
	preload: function() {
		// Function called first to load all the assets
		this.game.load.image("background_gameover", "assets/bg_gameover.png");
		this.game.load.image("playAgain", "assets/btn_playAgain.png");
	},

	create: function() {
		// Fuction called after 'preload' to setup the game
		var bgLayer = game.add.group();
		var btnLayer = game.add.group();

		this.bg = bgLayer.create(0, 0, 'background_gameover');
		game.add.button(game.world.centerX - 94, 420, 'playAgain', clickPlayBtn, this, 2, 1, 0);

		var style = { font: "32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
		text = game.add.text(game.world.centerX, game.world.centerY - 75, "" + score, style);
	},
	update: function() {
	}
};

// Add and start the 'main' state to start the game
game.state.add('splash', game_state.splash);
game.state.add('main', game_state.main);
game.state.add('gameOver', game_state.gameOver);
game.state.start('splash');