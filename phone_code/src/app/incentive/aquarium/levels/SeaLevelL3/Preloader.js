export class PreloaderL3 extends Phaser.State {
	
	preload(){

		//console.log("Preloader: preload called"); 

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        
        //---- both aquariums
        this.load.bitmapFont('eightbitwonder', 'assets/fonts/eightbitwonder.png', 'assets/fonts/eightbitwonder.fnt');
		this.load.json('fishpoints', 'assets/game/fishpoints.json');//fish json, points
		this.load.image('fish_progress', 'assets/game/sprite/fish_progress_s.png');
		//this.load.spritesheet('timer', 'assets/game/sprite/timer.png', 150, 20);

		this.add.text(0, 0, "hack", {font:"1px dumbo_regular", fill:"#FFFFFF"});
		//this.load.spritesheet('timer', 'assets/game/sprite/timer.png', 150, 20);
		this.load.spritesheet('timer', 'assets/img/timer_red.png', 150, 20);
		this.load.image('points_progress_2', 'assets/img/points_progress_2.png');
		this.load.image('levels_progress', 'assets/img/levels_progress_2.png');
		this.load.image('streak_info', 'assets/img/streak_info_2.png');
		this.load.spritesheet('timer_grey', 'assets/img/timer_grey.png', 150, 20);
		this.load.spritesheet('timer_yellow', 'assets/img/timer_yellow.png', 150, 20);
		this.load.spritesheet('timer_pumpkin', 'assets/img/timer_pumpkin.png', 150, 20);
		this.load.image('alt_icon', 'assets/img/heart.png');
		this.load.image('next_fish_icon', 'assets/img/fish_icon_2.png');
		this.load.image('meme_icon', 'assets/img/smiley_face.png');
		this.load.spritesheet('level_up_progress', 'assets/img/level_up.png', 150, 20);
		this.load.image('level_up_icon', 'assets/img/level_icon.png');
		this.load.image('level_up_2', 'assets/img/level_up_2.png');
		this.load.image('streak_green', 'assets/img/streak_green.png');
		this.load.image('streak_red', 'assets/img/streak_red_2.png');
		this.load.image('streak_grey', 'assets/img/streak_grey.png');
		this.load.image('star_point', 'assets/img/star.png');
		this.load.atlasJSONArray('info_sprite', 'assets/game/sprite/info_sprite.png', 'assets/game/sprite/info_sprite.json');
		

		var max = 8;
		var min = 1;
		var rand_num = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log('assets/img/pirate-' + rand_num + '.png');
		this.load.image('pirate', 'assets/img/pirate-' + rand_num + '.png');

		var	username = window.localStorage['username'] || 'unknown';

        this.isStudyParticipant = username.indexOf('-study-') !== -1; // !== -1;
		this.loadSea();

		//--- RedBanner.png
		this.load.image('banner', 'assets/img/RedBanner.png');
		this.load.image('banner_fish', 'assets/img/banner_fish.png');


		//----
		var next_fish = window.localStorage['next_fish'] || 'assets/img/aquarium_grey/clownfish.png';
		console.log("Next fish: " + next_fish);
		this.load.image('clownfish_grey', next_fish);

		this.load.image('diamond', 'assets/img/diamond.png');

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
	}

	update()
	{
		console.log("update: "+ "SeaLevelL3");
		this.state.start('SeaLevelL3');
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}

	loadSea(){
        //second aquarium
        //-- fish_journal
		console.log("Inside loadSea");
        this.load.image('fish_journal', 'assets/img/fish_journal.png');

         //--- sea
		this.load.image('undersea', 'assets/img/underwaterbr.jpg');    	
        this.load.image('treasuresea', 'assets/img/treasuresea.png');
		this.load.image('coral', 'assets/img/seabed.png');
		this.load.atlasJSONArray('clownfish', 'assets/game/sprite/clownfish.png', 'assets/game/sprite/clownfish.json');
		this.load.atlasJSONArray('dori', 'assets/game/sprite/dory2.png', 'assets/game/sprite/dory2.json');
		this.load.atlasJSONArray('jellyfish', 'assets/game/sprite/jellyfish.png', 'assets/game/sprite/jellyfish.json');
		this.load.atlasJSONArray('redcrab', 'assets/game/sprite/redcrab.png', 'assets/game/sprite/redcrab.json');
		this.load.atlasJSONArray('greencrab', 'assets/game/sprite/greencrab.png', 'assets/game/sprite/greencrab.json');
		this.load.atlasJSONArray('angryfish', 'assets/game/sprite/angryfish.png', 'assets/game/sprite/angryfish.json');
		this.load.atlasJSONArray('salmon', 'assets/game/sprite/salmon.png', 'assets/game/sprite/salmon.json');
		this.load.atlasJSONArray('yellowtang', 'assets/game/sprite/yellowtang.png', 'assets/game/sprite/yellowtang.json');
		this.load.spritesheet('blueanchovy', 'assets/game/sprite/blueanchovy.png', 512, 125, 4);
		this.load.spritesheet('greenanchovy', 'assets/game/sprite/greenanchovy.png', 512, 125, 4);
		this.load.spritesheet('pinkanchovy', 'assets/game/sprite/pinkanchovy.png', 512, 125, 4);

		//this.load.atlasJSONArray('sharkswim', 'assets/game/sprite/sharkswimming.png', 'assets/game/sprite/sharkswimming.json');
        //this.load.atlasJSONArray('nemo', 'assets/game/sprite/clownfish.png', 'assets/game/sprite/clownfish.json');
		//this.load.atlasJSONArray('swordfish', 'assets/game/sprite/swordfish.png', 'assets/game/sprite/swordfish.json');
		//this.load.atlasJSONArray('dolphin', 'assets/game/sprite/dolphin.png', 'assets/game/sprite/dolphin.json');
		//this.load.atlasJSONArray('kitefish', 'assets/game/sprite/kitefish.png', 'assets/game/sprite/kitefish.json');
		//this.load.atlasJSONArray('whale', 'assets/game/sprite/whale.png', 'assets/game/sprite/whale.json');

		
		//
		//this.load.image('gotosea', 'assets/img/gotosea.png');

		//first_aq
		//this.load.image('first_aq', 'assets/img/first_aq.png');

		

		//submarine
		//this.load.atlasJSONArray('submarine', 'assets/game/sprite/submarine.png', 'assets/game/sprite/submarine.json');
		//this.load.atlasJSONArray('submarine_at', 'assets/game/sprite/submarine_at.png', 'assets/game/sprite/submarine_at.json');

		//this.preloadBar.destroy();

	}
}