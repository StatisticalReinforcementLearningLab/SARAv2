export class PreloaderL1 extends Phaser.State {
	
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
		this.load.spritesheet('timer', 'assets/game/sprite/timer.png', 150, 20);

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
		this.loadFishBowl();

		//--- RedBanner.png
		//this.load.atlasJSONArray('banner', 'sprite/RedBanner.png', 'sprite/RedBanner.json');
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
		console.log("update: "+ this.pickedGame);
		this.state.start('FishBowlL1');
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}

	loadFishBowl(){

		//
		console.log("Inside loadFishBowl");
		this.load.image('titlescreen', 'assets/img/TitleBG4.png');    	
        this.load.image('journal', 'assets/img/fishjournal.png');
			   
		//
        this.load.image('fish', 'assets/img/fish.png');
		this.load.image('treasure', 'assets/img/treasure.png');
		this.load.atlasJSONArray('clownfish', 'assets/game/sprite/clownfish.png', 'assets/game/sprite/clownfish.json');
		this.load.atlasJSONArray('squid', 'assets/game/sprite/squid.png', 'assets/game/sprite/squid.json');
		this.load.atlasJSONArray('butterfly', 'assets/game/sprite/butterfly.png', 'assets/game/sprite/butterfly.json');
		this.load.atlasJSONArray('tigerbarb', 'assets/game/sprite/tigerbarb.png', 'assets/game/sprite/tigerbarb.json');
		this.load.atlasJSONArray('puffer', 'assets/game/sprite/pufferfish.png', 'assets/game/sprite/pufferfish.json');
		this.load.atlasJSONArray('angelfish', 'assets/game/sprite/angelfish.png', 'assets/game/sprite/angelfish.json');
		this.load.atlasJSONArray('greenfish', 'assets/game/sprite/swimrightgreenfish.png', 'assets/game/sprite/swimrightgreenfish.json');
		
		//
		this.load.spritesheet('greenstarfish', 'assets/game/sprite/greenstarfish.png', 512, 512, 3);
		this.load.spritesheet('redstarfish', 'assets/game/sprite/redstarfish.png', 512, 512, 3);
		this.load.spritesheet('bluestarfish', 'assets/game/sprite/bluestarfish.png', 512, 512, 3);

		//
		this.load.atlasJSONArray('goldfish', 'assets/game/sprite/goldfish.png', 'assets/game/sprite/goldfish.json');
		this.load.atlasXML('octopus', 'assets/game/sprite/octopus.png', 'assets/game/sprite/octopus.xml');
		this.load.atlasXML('seacreatures', 'assets/game/sprite/seacreatures.png', 'assets/game/sprite/seacreatures.xml');

		
		//
		this.load.image('smiley', 'assets/img/smiley.png');

	}
}