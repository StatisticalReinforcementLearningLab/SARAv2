export class Preloader extends Phaser.State {
    //preloadBar = null;
    //this.titleText = null;
    //ready = false;
    //ionic_scope;
    //isStudyParticipant;
	
	preload(){

		//console.log("Preloader: preload called"); 

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        
        //---- both aquariums
        this.load.bitmapFont('eightbitwonder', 'assets/fonts/eightbitwonder.png', 'assets/fonts/eightbitwonder.fnt');
		this.load.json('fishpoints', 'assets/game/fishpoints.json');//fish json, points

		//
		this.load.atlasJSONArray('clownfish', 'assets/game/sprite/clownfish.png', 'assets/game/sprite/clownfish.json');

		//
		this.load.image('fish_progress', 'assets/game/sprite/fish_progress_s.png');

		
		//progress bar
		this.load.spritesheet('timer', 'assets/game/sprite/timer.png', 150, 20);

		//reward
		this.load.image('ball', 'assets/img/bubble256yay.png');
		this.load.image('gift', 'assets/img/gift.png');

		//
		this.load.image('gameover', 'assets/img/Fireworks.png');


		//this.load.atlasJSONArray('blackdiver', 'sprite/black-diver-sprite.png', 'sprite/black-diver-sprite.json');

		//
		//Returns a random integer between min (inclusive) and max (inclusive)
		//Using Math.round() will give you a non-uniform distribution!
		//
		var max = 8;
		var min = 1;
		var rand_num = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log('assets/img/pirate-' + rand_num + '.png');
		this.load.image('pirate', 'assets/img/pirate-' + rand_num + '.png');

		var	username = window.localStorage['username'] || 'unknown';
        this.isStudyParticipant = username.indexOf('-study-') !== -1; // !== -1;
        //-- this.isStudyParticipant = true;
        //-- 
		//this.ionic_scope.total_points = 900;  
		/*
		if((this.ionic_scope.total_days > 30) && this.isStudyParticipant){
            this.loadGameover();
        }else{
        	if(this.ionic_scope.total_points <1060){
				this.loadFishBowl();
        	}else{
        		this.loadSea();
        	}
		}
		*/
		this.loadFishBowl(); //temporarility use this

		//--- RedBanner.png
		//this.load.atlasJSONArray('banner', 'sprite/RedBanner.png', 'sprite/RedBanner.json');
		this.load.image('banner', 'assets/img/RedBanner.png');
		this.load.image('banner_fish', 'assets/img/banner_fish.png');


		//----
		var next_fish = window.localStorage['next_fish'] || 'assets/img/aquarium_grey/clownfish.png';
		//next_fish = 'img/aquarium_grey/clownfish.png';
		console.log("Next fish: " + next_fish);
		this.load.image('clownfish_grey', next_fish);

		/*
		this.load.image('pouch', 'img/pouch.png');
		this.load.image('full_money', 'img/full_money.png');
		this.load.image('empty_money', 'img/empty_money.png');
		*/
		this.load.image('diamond', 'assets/img/diamond.png');


		//start loading
		//this.load.start();

		var progressDisplay = 0;
		var timerEvt = this.time.events.loop(100, function (){
            if(this.load.progress < 100){
            	progressDisplay++;
                console.log('loading... '+(this.load.progress)+'%' + "; " + (100*progressDisplay));
            }else{
                //loadingText.text = 'Ready, Go!';
                console.log('Ready, Go!');
                this.time.events.remove(timerEvt);
            }

        }, this);
		 
		
	}

	create(){
		console.log("Preloader: create called");
		this.preloadBar.cropEnabled = false;
		//this.load.image('treasuresea', 'img/treasuresea.png');
        //this.load.atlasJSONArray('greencrab', 'sprite/greencrab.png', 'sprite/greencrab.json');
		//this.load.atlasJSONArray('angryfish', 'sprite/angryfish.png', 'sprite/angryfish.json');
		//this.load.atlasJSONArray('swordfish', 'sprite/swordfish.png', 'sprite/swordfish.json');
		//this.load.start();
	}

	/*
	assignscope(scope) {
        this.ionic_scope = scope;
	}
	*/

    //this is how to handle progress bar 
    //--- See on file complete http://technotip.com/4897/progress-bar-phaser/

	update(){

		//
		console.log("Preloader: update called");

		//this.cache.isSoundDecoded('game_audio') && 
        if(this.ready == true) {
            //this.ionic_scope.total_points = 1650;  	
			this.ionic_scope = {};
			this.ionic_scope.total_points = 50;
			this.ionic_scope.total_days = 5;
            console.log("Days: " + this.ionic_scope.total_days + ", isStudyParticipant: " + this.isStudyParticipant);
            if((this.ionic_scope.total_days > 30) && this.isStudyParticipant){
            	this.state.start('Gameover');
            }else{
	            if(this.ionic_scope.total_points <770){
	            	this.state.start('GameSmall');
	            	this.ionic_scope.current_level = 'GameSmall';
	            	console.log("post loading sea");
	            	//this.loadSea();
	            	//this.load.start();
	            }


	            if(this.ionic_scope.total_points >=770 && this.ionic_scope.total_points <1060){
	            	this.state.start('Game');
	            	this.ionic_scope.current_level = 'Game';
	            	console.log("post loading sea");
	            	//this.loadSea();
	            	//this.load.start();
	            }


	            if(this.ionic_scope.total_points >=1060 && this.ionic_scope.total_points <1710){
	            	this.state.start('Level1Small');
	            	this.ionic_scope.current_level = 'Level1Small';
	            	console.log("post loading fishbowl");
	            	this.loadFishBowl();
	            	this.load.start();
	            }

	            if(this.ionic_scope.total_points >=1710){
					this.state.start('Level1');
					//this.state.start('Gameover');
					//this.state.start('Gamelast');
	            	this.ionic_scope.current_level = 'Level1';
	            	console.log("post loading fishbowl");
	            	this.loadFishBowl();
	            	this.load.start();
	            }
	        }

            //this.state.start('Game');
            //this.state.start('Level1');
            //this.state.start('Level1Small');
        }
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}

	loadFishBowl(){
		this.load.image('titlescreen', 'assets/img/TitleBG4.png');    	
        this.load.image('journal', 'assets/img/fishjournal.png');
        

        
        this.load.image('fish', 'assets/img/fish.png');
		this.load.image('treasure', 'assets/img/treasure.png');
		this.load.atlasXML('octopus', 'assets/game/sprite/octopus.png', 'assets/game/sprite/octopus.xml');
		this.load.atlasXML('seacreatures', 'assets/game/sprite/seacreatures.png', 'assets/game/sprite/seacreatures.xml');
		this.load.atlasJSONArray('greenfish', 'assets/game/sprite/swimrightgreenfish.png', 'assets/game/sprite/swimrightgreenfish.json');
		this.load.atlasJSONArray('seahorseyellow', 'assets/game/sprite/seahorseyellow.png', 'assets/game/sprite/seahorseyellow.json');
		this.load.atlasJSONArray('squid', 'assets/game/sprite/squid.png', 'assets/game/sprite/squid.json');
		this.load.atlasJSONArray('goldfish', 'assets/game/sprite/goldfish.png', 'assets/game/sprite/goldfish.json');
		this.load.atlasJSONArray('angelfish', 'assets/game/sprite/angelfish.png', 'assets/game/sprite/angelfish.json');
		this.load.atlasJSONArray('discusfish', 'assets/game/sprite/discusfish.png', 'assets/game/sprite/discusfish.json');
		this.load.atlasJSONArray('bettafish', 'assets/game/sprite/betta.png', 'assets/game/sprite/betta.json');
		//this.load.atlasJSONArray('guppy', 'assets/game/sprite/guppy.png', 'assets/game/sprite/guppy.json');
		this.load.atlasJSONArray('puffer', 'assets/game/sprite/pufferfish.png', 'assets/game/sprite/pufferfish.json');
		this.load.atlasJSONArray('tigerbarb', 'assets/game/sprite/tigerbarb.png', 'assets/game/sprite/tigerbarb.json');
		this.load.atlasJSONArray('butterfly', 'assets/game/sprite/butterfly.png', 'assets/game/sprite/butterfly.json');

		this.load.spritesheet('greenstarfish', 'assets/game/sprite/greenstarfish.png', 512, 512, 3);
		this.load.spritesheet('redstarfish', 'assets/game/sprite/redstarfish.png', 512, 512, 3);
		this.load.spritesheet('bluestarfish', 'assets/game/sprite/bluestarfish.png', 512, 512, 3);

		//divers
		this.load.atlasJSONArray('purplediver', 'assets/game/sprite/purple-diver-sprite.png', 'assets/game/sprite/purple-diver-sprite.json');
		this.load.atlasJSONArray('blackdiver', 'assets/game/sprite/black-diver-sprite.png', 'assets/game/sprite/black-diver-sprite.json');
		this.load.atlasJSONArray('fatdiver', 'assets/game/sprite/fat_swimmer.png', 'assets/game/sprite/fat_swimmer.json');
		
		//
		this.load.image('smiley', 'assets/img/smiley.png');
		this.load.image('diver', 'assets/img/diver-0.png');
		this.load.image('fatdiver2', 'assets/img/fatdiver2.png');

		

	}

	loadSea(){
		//this.load.audio('game_audio', 'audio/poop.mp3');

        //second aquarium
        //-- fish_journal
        this.load.image('fish_journal', 'img/fish_journal.png');

         //--- sea
        this.load.image('undersea', 'img/underwaterbr.jpg');
        this.load.image('treasuresea', 'img/treasuresea.png');
        this.load.image('coral', 'img/seabed.png');
        this.load.atlasJSONArray('sharkswim', 'assets/game/sprite/sharkswimming.png', 'assets/game/sprite/sharkswimming.json');
        this.load.atlasJSONArray('nemo', 'assets/game/sprite/clownfish.png', 'assets/game/sprite/clownfish.json');
		this.load.atlasJSONArray('dori', 'assets/game/sprite/dory2.png', 'assets/game/sprite/dory2.json');
		this.load.atlasJSONArray('jellyfish', 'assets/game/sprite/jellyfish.png', 'assets/game/sprite/jellyfish.json');
		this.load.atlasJSONArray('redcrab', 'assets/game/sprite/redcrab.png', 'assets/game/sprite/redcrab.json');
		this.load.atlasJSONArray('greencrab', 'assets/game/sprite/greencrab.png', 'assets/game/sprite/greencrab.json');
		this.load.atlasJSONArray('angryfish', 'assets/game/sprite/angryfish.png', 'assets/game/sprite/angryfish.json');
		this.load.atlasJSONArray('swordfish', 'assets/game/sprite/swordfish.png', 'assets/game/sprite/swordfish.json');
		this.load.atlasJSONArray('salmon', 'assets/game/sprite/salmon.png', 'assets/game/sprite/salmon.json');
		this.load.atlasJSONArray('yellowtang', 'assets/game/sprite/yellowtang.png', 'assets/game/sprite/yellowtang.json');
		this.load.atlasJSONArray('dolphin', 'assets/game/sprite/dolphin.png', 'assets/game/sprite/dolphin.json');
		this.load.atlasJSONArray('kitefish', 'assets/game/sprite/kitefish.png', 'assets/game/sprite/kitefish.json');
		this.load.atlasJSONArray('whale', 'assets/game/sprite/whale.png', 'assets/game/sprite/whale.json');
		this.load.spritesheet('blueanchovy', 'assets/game/sprite/blueanchovy.png', 512, 125, 4);
		this.load.spritesheet('greenanchovy', 'assets/game/sprite/greenanchovy.png', 512, 125, 4);
		this.load.spritesheet('pinkanchovy', 'assets/game/sprite/pinkanchovy.png', 512, 125, 4);

		
		//
		this.load.image('gotosea', 'img/gotosea.png');

		//first_aq
		this.load.image('first_aq', 'img/first_aq.png');

		

		//submarine
		this.load.atlasJSONArray('submarine', 'assets/game/sprite/submarine.png', 'assets/game/sprite/submarine.json');
		this.load.atlasJSONArray('submarine_at', 'assets/game/sprite/submarine_at.png', 'assets/game/sprite/submarine_at.json');

		//this.preloadBar.destroy();

	}

	loadGameover(){
		//
		//this.load.image('gameover', 'img/Fireworks.png');
	}
}