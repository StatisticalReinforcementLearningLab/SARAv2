export class PreloaderTundraL5 extends Phaser.State {
	
	preload(){

		console.log("Preload called");
		this.input.addPointer();
		

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
        
        //---- both aquariums
        this.load.bitmapFont('eightbitwonder', 'assets/fonts/eightbitwonder.png', 'assets/fonts/eightbitwonder.fnt');
		this.load.json('fishpoints', 'assets/game/fishpoints.json');//fish json, points
		this.load.image('fish_progress', 'assets/game/sprite/fish_progress_s.png');
		this.load.spritesheet('timer', 'assets/game/sprite/timer.png', 150, 20);

		this.load.image('diamond', 'assets/img/diamond.png');


		//----
		var next_fish = window.localStorage['next_fish'] || 'assets/img/aquarium_grey/clownfish.png';
		this.load.image('clownfish_grey', next_fish);


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
		

        this.game.load.image('tundra1','assets/pics/bg-tundra.png');
        
		this.game.load.atlasJSONArray('penguin', 'assets/game/sprite/penguin_sprite.png', 'assets/game/sprite/penguin_sprite.json');
		this.game.load.atlasJSONArray('sea_lion_silver', 'assets/game/sprite/sea_lion_silver_sprite.png', 'assets/game/sprite/sea_lion_silver_sprite.json');
		this.game.load.atlasJSONArray('sea_lion_brown', 'assets/game/sprite/sea_lion_brown_sprite.png', 'assets/game/sprite/sea_lion_brown_sprite.json');
		
		//
		this.game.load.atlasJSONArray('wolf_walk', 'assets/game/sprite/wolf_walk_sprite.png', 'assets/game/sprite/wolf_walk_sprite.json');

		//
		this.game.load.atlasJSONArray('bird_fly', 'assets/game/sprite/bird_tundra_sprite.png', 'assets/game/sprite/bird_tundra_sprite.json');


		//
		this.game.load.atlasJSONArray('hare', 'assets/game/sprite/hare_tundra_sprite.png', 'assets/game/sprite/hare_tundra_sprite.json');
		this.game.load.atlasJSONArray('pingu', 'assets/game/sprite/pingu_tundra_sprite.png', 'assets/game/sprite/pingu_tundra_sprite.json');
		this.game.load.atlasJSONArray('coyote', 'assets/game/sprite/coyote_tundra_sprite.png', 'assets/game/sprite/coyote_tundra_sprite.json');
		
		
    
        //
        this.game.load.atlasJSONArray('grey_husky', 'assets/game/sprite/husky_grey_tundra_sprite.png', 'assets/game/sprite/husky_grey_tundra_sprite.json');
        this.game.load.atlasJSONArray('white_husky', 'assets/game/sprite/husky_white_tundra_sprite.png', 'assets/game/sprite/husky_white_tundra_sprite.json');

		//
		this.game.load.atlasJSONArray('yeti_walk', 'assets/game/sprite/yeti_walk_sprite.png', 'assets/game/sprite/yeti_walk_sprite.json');
		this.game.load.atlasJSONArray('yeti_laugh', 'assets/game/sprite/yeti_laugh_sprite.png', 'assets/game/sprite/yeti_laugh_sprite.json');
		

		//
		this.game.load.atlasJSONArray('brown_bear', 'assets/game/sprite/brown_bear.png', 'assets/game/sprite/brown_bear.json');
		this.game.load.atlasJSONArray('rabbit', 'assets/game/sprite/rabbit.png', 'assets/game/sprite/rabbit.json');
		this.game.load.atlasJSONArray('reindeer', 'assets/game/sprite/reindeer.png', 'assets/game/sprite/reindeer.json');
		

		//
		this.load.image('treasure_tundra', 'assets/img/igloo_tresurechest.png');

		//
		this.load.image('yeti_standing', 'assets/game/sprite/yeti_standing.png');

		//
		this.load.image('snowgswitch', 'assets/img/snowglobe.png');

		//
		this.game.load.spritesheet('snowflakes', 'assets/game/sprite/snowflakes.png', 17, 17);
		//snowflakes.png
	}

	create(){
		console.log("Preloader: create called");
		this.preloadBar.cropEnabled = false;
	}

	update(){
		console.log("update: "+ 'TundraLevel1');
		this.state.start('TundraLevel1');
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}

	
}