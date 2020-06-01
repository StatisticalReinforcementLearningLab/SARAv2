export class PreloaderRainforestL6 extends Phaser.State {
	
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




		this.game.load.image('rock2','assets/pics/rock2.png');
		
		this.game.load.image('reinforest1','assets/pics/bg-rainforest-top-V2.png');
		this.load.image('reinforestBackgroundBottom1', 'assets/pics/bg-rainforest-bottom-1.png'); 
		this.load.image('reinforestBackgroundBottom2', 'assets/pics/bg-rainforest-bottom-2.png'); 


		this.game.load.image('treasure', 'assets/img/treasure_chest_rainforest.png');
        this.game.load.atlasJSONArray('attackplant', 'assets/game/sprite/attack_plant.png', 'assets/game/sprite/attack_plant.json');
        this.game.load.atlasJSONArray('thirstyplant', 'assets/game/sprite/thirsty_plant.png', 'assets/game/sprite/thirsty_plant.json');
        this.game.load.atlasJSONArray('squirrel', 'assets/game/sprite/squirrel_run-0.png', 'assets/game/sprite/squirrel_run.json');
        this.game.load.atlasJSONArray('ostrich', 'assets/game/sprite/ostrich_sprite.png', 'assets/game/sprite/ostrich_sprite.json');
		this.game.load.atlasJSONArray('jaguar', 'assets/game/sprite/Jaquar.png', 'assets/game/sprite/Jaquar.json');
		
		this.game.load.atlasJSONArray('pegions', 'assets/game/sprite/5-pegions.png', 'assets/game/sprite/5-pegions.json');
        this.game.load.atlasJSONArray('lion', 'assets/game/sprite/brave_lion_idle-0.png', 'assets/game/sprite/brave_lion_idle-0.json');
        this.game.load.atlasJSONArray('triceratops', 'assets/game/sprite/triceratops_idle_sprit.png', 'assets/game/sprite/triceratops_idle_sprit.json');
        this.game.load.atlasJSONArray('koala', 'assets/game/sprite/koala_sprite.png', 'assets/game/sprite/koala_sprite.json');
        this.game.load.atlasJSONArray('lionjump', 'assets/game/sprite/brave_lion_jump-0.png', 'assets/game/sprite/brave_lion_jump-0.json');

        //
        this.game.load.atlasJSONArray('corn_stand', 'assets/game/sprite/cron_stand_sprite.png', 'assets/game/sprite/cron_stand_sprite.json');
        this.game.load.atlasJSONArray('corn_attach', 'assets/game/sprite/cron_attack_sprite.png', 'assets/game/sprite/cron_attack_sprite.json');

        //
        this.game.load.atlasJSONArray('vulture_flying', 'assets/game/sprite/vulture_sprite.png', 'assets/game/sprite/vulture_sprite.json');
        this.game.load.atlasJSONArray('sparrow_flying', 'assets/game/sprite/sparrow_sprite.png', 'assets/game/sprite/sparrow_sprite.json');
        this.game.load.atlasJSONArray('goose_flying', 'assets/game/sprite/goose_sprite.png', 'assets/game/sprite/goose_sprite.json');
        this.game.load.atlasJSONArray('owl_flying', 'assets/game/sprite/owl_sprite.png', 'assets/game/sprite/owl_sprite.json');
        this.game.load.atlasJSONArray('duck_flying', 'assets/game/sprite/duck_sprite.png', 'assets/game/sprite/duck_sprite.json');
		this.game.load.atlasJSONArray('macaw_flying', 'assets/game/sprite/Macaw.png', 'assets/game/sprite/Macaw.json');
		
		//monkeys
		this.game.load.image('treeBranch','assets/img/branch-tree.png');
		//this.game.load.atlasJSONArray('redMonkey', 'assets/game/sprite/RedMonkey.png', 'assets/game/sprite/RedMonkey.json');
        //this.game.load.atlasJSONArray('brownMonkey', 'assets/game/sprite/BrownMonkey.png', 'assets/game/sprite/BrownMonkey.json');
        //this.game.load.atlasJSONArray('blackMonkey', 'assets/game/sprite/BlackMonkey.png', 'assets/game/sprite/BlackMonkey.json');
		
		//butter fly
		this.game.load.image('flowerBush','assets/img/flower-bush.png');
		this.game.load.atlasJSONArray('butterfly', 'assets/game/sprite/butterfly.png', 'assets/game/sprite/butterfly.json');
        
		this.game.load.spritesheet('rain', 'assets/game/sprite/rain.png', 17, 17)
//
		//this.load.image('snowgswitch', 'assets/img/snowglobe.png');
		this.load.image('rain_start', 'assets/img/start_rain.png');
		this.load.image('rain_end', 'assets/img/stop_rain.png');
		//

		

	}	

	create(){
		console.log("Preloader: create called");
		this.preloadBar.cropEnabled = false;
	}

	update(){
		console.log("update: "+ 'RainforestLevel6');
		this.state.start('RainforestLevel6');
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}
}