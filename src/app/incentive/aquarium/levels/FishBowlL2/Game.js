export class FishBowlL2 extends Phaser.State {

    //componentObject;
    constructor(){
        super();
        this.componentObject;
    }
    
    create() {

        this.gameover = false;
        this.totalClicks = 0;
        this.isPrawnAdded = false;
        this.isClownFishAdded = false;

        this.previoous_fish_point  = 0;
        this.next_fish_point  = 0;

        // = 382.0;
        //if(window.innerWidth > this.CANVAS_WIDTH)
        this.CANVAS_WIDTH = window.innerWidth;
        
        this.buildWorld();
        this.inputEnabled = false;

        //
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

    }

    buildWorld() {

        //
        //this.height = window.innerHeight-44;
        this.height = this.game.height;
        var titlescreen = this.add.image(0, this.height-160, 'titlescreen');
        titlescreen.scale.setTo(0.85, 0.85);

        //
        /*
        var fish_progress = this.add.image(175,50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
        */

        //var info_progress_bar = this.add.image(175,50, 'info');
        //info_progress_bar.scale.setTo(0.3, 0.3);
        //info_progress_bar.anchor.setTo(.5,.5);

        /*
        var info_progress_bar = this.add.sprite(175,53, 'info_sprite');
        info_progress_bar.animations.add('swim');
        info_progress_bar.animations.play('swim', 1, true);
        info_progress_bar.scale.setTo(0.3, 0.3);
        info_progress_bar.anchor.setTo(.5,.5);
        info_progress_bar.inputEnabled = true;
        //function(){doAlert(textString)
        info_progress_bar.events.onInputDown.add(function(){this.showInforBox("Info pregess bar cliccked")}, this);
        */

        /*
        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);
        */

        var treasure = this.add.image(90, this.height-70, 'treasure');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);

        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);
        /*
        this.totalPoints = 100;
        var points_str = "" + this.totalPoints;
        if(this.totalPoints < 10)
            points_str = "000" + this.totalPoints;
        if(this.totalPoints>=10 && this.totalPoints<100)
            points_str = "00" + this.totalPoints;
        if(this.totalPoints>=100 && this.totalPoints<1000)
            points_str = "0" + this.totalPoints;
        */

           

        //
        /*
        var journal = this.add.image(this.CANVAS_WIDTH - 70, 10, 'journal');
        journal.scale.setTo(0.4, 0.4);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);  
        */ 

        

        //
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);



        

        //this.totalPoints = 1000;
        this.buildFish();
        this.addFishes();

        //
        this.showProgressBars();

        //this.checkReinforcement();
        this.showBanner();

    }

    showProgressBars(){

        var current_points = this.totalPoints;

        //------ Left side

        

        //level info
        //var levels_progress = this.add.image(5, 55, 'levels_progress');
        //levels_progress.scale.setTo(.27, .30);

        /*
        //
        var levels_progress = this.add.sprite(10, 58, 'level_up_progress', 0);
        levels_progress.scale.setTo(0.95, 1.2);

        //var progress_sprite = this.game.add.sprite(88, 59, 'level_up_progress', 1);
        var progress_sprite = this.game.add.sprite(10, 59, 'level_up_progress', 1);
        var rect = new Phaser.Rectangle(50, 0, 0, progress_sprite.height);
        var percent = (current_points-this.previoous_fish_point)/(this.next_fish_point-this.previoous_fish_point);
        if(percent == 0)
          percent = 0.05;
        console.log("" + current_points + "," + this.previoous_fish_point + "," + this.next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * progress_sprite.width);
        console.log("Width, " + rect.width  + "," + progress_sprite.width);
        progress_sprite.crop(rect);
        //progress_sprite.anchor.setTo(0,0);
        progress_sprite.scale.setTo(1,1.1);


        var level_up_icon = this.add.image(18, 68, 'level_up_icon');
        level_up_icon.scale.setTo(.5, .5);
        level_up_icon.anchor.setTo(.5, .5);

        var info_level_progress = this.add.sprite(2 + levels_progress.width + 18, 74, 'info_sprite');
        info_level_progress.animations.add('swim');
        info_level_progress.animations.play('swim', 1, true);
        info_level_progress.scale.setTo(0.3, 0.3);
        info_level_progress.anchor.setTo(.5,.5);
        info_level_progress.inputEnabled = true;
        info_level_progress.events.onInputDown.add(function(){this.showInforBox("Info level progress bar clicked")}, this); 

        
        //progress_sprite.anchor.setTo(1,0);
        //progress_sprite.scale.setTo(0.8,0.8);
        */



        //streak_info
        var streak_info = this.add.image(5, 5, 'streak_info');
        streak_info.scale.setTo(.30, .30);

        var info_level_streak = this.add.sprite(2 + streak_info.width + 14, 24, 'info_sprite');
        info_level_streak.animations.add('swim');
        info_level_streak.animations.play('swim', 1, true);
        info_level_streak.scale.setTo(0.3, 0.3);
        info_level_streak.anchor.setTo(.5,.5);
        info_level_streak.inputEnabled = true;
        info_level_streak.events.onInputDown.add(function(){this.showInforBox("Streak progress bar clicked")}, this); 

        var colors = ['green','green','green','green','grey','green','grey'];
        var streak_tile;
        for(var i=0; i < colors.length; i++){
            streak_tile = this.add.image(40 + i*15, 11, 'streak_' + colors[i]);
            streak_tile.scale.setTo(.15*4, .27*4);
        }


        //------ Right side


        //points bar
        vertical_position_offset = 13;
        var points_progress = this.add.image(this.CANVAS_WIDTH, 2, 'points_progress_2');
        points_progress.scale.setTo(.36, .30);
        points_progress.anchor.setTo(1,0);
        var points_text = this.add.text(this.CANVAS_WIDTH - 70, 10, "" + this.totalPoints, {font:"20px dumbo_regular", fill:"#4c3d01"});
        points_text.anchor.setTo(0.5,0);

        var star_icon = this.add.image(this.CANVAS_WIDTH-16, vertical_position_offset+5, 'star_point');
        star_icon.scale.setTo(.52, .52);
        star_icon.anchor.setTo(.5, .5);

        /*
        var info_points = this.add.sprite(2 + points_progress.width + 13, 32, 'info_sprite');
        info_points.animations.add('swim');
        info_points.animations.play('swim', 1, true);
        info_points.scale.setTo(0.3, 0.3);
        info_points.anchor.setTo(.5,.5);
        info_points.inputEnabled = true;
        //function(){doAlert(textString)
        info_points.events.onInputDown.add(function(){this.showInforBox("Info pregess bar cliccked 2")}, this); 
        */

        
        //points to get to next fish.
        vertical_position_offset = 40;
        var progress_bar_fish =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_grey', 1);
        progress_bar_fish.anchor.setTo(1,0);
        progress_bar_fish.scale.setTo(0.8,0.5);

        var progress_sprite = this.game.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_grey', 0);
        var rect = new Phaser.Rectangle(0, 0, 0, progress_sprite.height);
        var percent = (current_points-this.previoous_fish_point)/(this.next_fish_point-this.previoous_fish_point);
        if(percent == 0)
          percent = 0.05;
        console.log("" + current_points + "," + this.previoous_fish_point + "," + this.next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * progress_sprite.width);
        console.log("Width, " + rect.width  + "," + progress_sprite.width);
        progress_sprite.crop(rect);
        progress_sprite.anchor.setTo(1,0);
        progress_sprite.scale.setTo(0.8,0.5);

        var fish_progress_icon = this.add.image(this.CANVAS_WIDTH-16, vertical_position_offset+8, 'next_fish_icon');
        fish_progress_icon.scale.setTo(.2*0.8, .2*0.8);
        fish_progress_icon.anchor.setTo(.5, .5);
        

        
        //points to get to meme.
        vertical_position_offset = 65;
        var progress_bar_memes =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_yellow', 1);
        progress_bar_memes.anchor.setTo(1,0);
        progress_bar_memes.scale.setTo(0.8,0.5);

        var start_number_of_memes = 0;
        var total_number_of_memes = 31;
        var already_shown_memes = window.localStorage["already_shown_memes3"];
        if(already_shown_memes == undefined)
            already_shown_memes = [{"filename": "assets/memes/4.jpg", "unlock_date": "blah"}]
        else
            already_shown_memes = JSON.parse(window.localStorage["already_shown_memes3"]);
        var currently_number_of_unlocked_memes = already_shown_memes.length;

        progress_sprite = this.game.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_yellow', 0);
        rect = new Phaser.Rectangle(0, 0, 0, progress_sprite.height);
        percent = (currently_number_of_unlocked_memes-start_number_of_memes)/
                  (total_number_of_memes-start_number_of_memes);
        percent = percent*0.8 + 0.2;
        rect.width = Math.max(0, percent * progress_sprite.width);
        progress_sprite.crop(rect);
        progress_sprite.anchor.setTo(1,0);
        progress_sprite.scale.setTo(0.8,0.5);

        var meme_icon = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+10, 'meme_icon');
        meme_icon.scale.setTo(.52*0.8, .52*0.8);
        meme_icon.anchor.setTo(.5, .5);


        //points to get to alt message.
        var vertical_position_offset = 90;
        var progress_bar_altruism_message =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer', 1);
        progress_bar_altruism_message.anchor.setTo(1,0);
        progress_bar_altruism_message.scale.setTo(0.8,0.5);

        var start_number_of_alt_messages = 0;
        var total_number_of_alt_messages = 21;

        var already_shown_altruism_msgs = window.localStorage["already_shown_alt_msg3"];
        if(already_shown_altruism_msgs == undefined)
            already_shown_altruism_msgs = [{"filename": "assets/altruism/altruism_1.png", "unlock_date": "blah"}]
        else
            already_shown_altruism_msgs = JSON.parse(window.localStorage["already_shown_alt_msg3"]);
        var currently_number_of_unlocked_alt_messages = already_shown_altruism_msgs.length;

        progress_sprite = this.game.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer', 0);
        rect = new Phaser.Rectangle(0, 0, 0, progress_sprite.height);
        percent = (currently_number_of_unlocked_alt_messages-start_number_of_alt_messages)/
                        (total_number_of_alt_messages-start_number_of_alt_messages);
        //if(percent < 0.05)
        percent = percent*0.8 + 0.2;
        rect.width = Math.max(0, percent * progress_sprite.width);
        console.log("Alt Width, " + rect.width  + "," + percent);
        progress_sprite.crop(rect);
        progress_sprite.anchor.setTo(1,0);
        progress_sprite.scale.setTo(0.8,0.5);

        
        var alt_icon = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+12, 'alt_icon');
        alt_icon.scale.setTo(.12*0.8, .12*0.8);
        alt_icon.anchor.setTo(.5, .5);
        


        //points to get to level up.
        var vertical_position_offset = 115;
        var progress_bar_level_up =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_pumpkin', 1);
        progress_bar_level_up.anchor.setTo(1,0);
        progress_bar_level_up.scale.setTo(0.8,0.5);

        // end of level is 1060, start is at 0
        var start_point_for_level = 0;
        var end_point_for_level = 1060;
        progress_sprite = this.game.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_pumpkin', 0);
        rect = new Phaser.Rectangle(0, 0, 0, progress_sprite.height);
        percent = (current_points-start_point_for_level)/(end_point_for_level-start_point_for_level);
        percent = percent*0.8 + 0.2;
        //console.log("" + current_points + "," + this.previoous_fish_point + "," + this.next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * progress_sprite.width);
        //console.log("Width, " + rect.width  + "," + progress_sprite.width);
        progress_sprite.crop(rect);
        progress_sprite.anchor.setTo(1,0);
        progress_sprite.scale.setTo(0.8,0.5);

        var level_up_2 = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+12, 'level_up_2');
        level_up_2.scale.setTo(.12*0.9, .12*0.9);
        level_up_2.anchor.setTo(.5, .5);






        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);
        //console.log("countdown.width " + this.countdown.width);

        
    }

    showBanner(){
        this.banner_object = this.add.group();
        //--- banner
        var banner = this.add.image(0, this.height-180, 'banner');
        banner.scale.setTo(.65, .95);
        banner.inputEnabled = true;
        //banner.events.onInputDown.add(this.hideBanner, this);
        this.banner_object.add(banner);
        banner.events.onInputDown.add(this.hideBanner, this);

        var banner_fish = this.add.image(290, this.height-210, 'info');
        banner_fish.scale.setTo(1, 1);
        banner_fish.inputEnabled = true;
        //banner_fish.events.onInputDown.add(this.hideBanner, this);
        this.banner_object.add(banner_fish);
        banner_fish.events.onInputDown.add(this.hideBanner, this);

        //
        var style = { font: "18px Arial", fill: "#f1c40f", align: "left", fontWeights: 'lighter' };
        var text = this.add.text(10, this.height-165, "New sea level is unlocked.\nClick the fish bowl\nto go to earlier level.", style);
        text.strokeThickness = 0;
        text.inputEnabled = true;
        //text.events.onInputDown.add(this.hideBanner, this);
        this.banner_object.add(text);
        text.events.onInputDown.add(this.hideBanner, this);

        //
        var style = { font: "13px Arial", fill: "#f1c40f", align: "left", fontStyle: 'italic', fontWeights: 'lighter'};
        var text2 = this.add.text(215, this.height-105, "Tap to hide", style);
        text2.strokeThickness = 0;
        text2.inputEnabled = true;
        //text2.events.onInputDown.add(this.hideBanner, this);
        this.banner_object.add(text2);
        text2.events.onInputDown.add(this.hideBanner, this);

        //make a left ot right animation.
    }

    hideBanner(elem){
        console.log("clicked");
        this.banner_object.destroy(true);
        window.localStorage['banner_shown_2'] = "1";
        //deleted all the elements
    }
    

    buildFish() {
        
          //assign number of fish
          this.numfish = 0;
          //assign type and age of fish
          var fishType = ["green1", "horse1", "purple1", "pink1", "magenta1"]
          this.fishGroup = this.add.group();
          this.fishGroup.enableBody = true;

          //
          for(var i = 0; i < this.numfish; i++){
              var b = this.fishGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.integerInRange(this.world.height-300, this.world.height-200), fishType[i]);
              b.anchor.setTo(0.5, 0.5);
              b.body.moves = false;
              b.inputEnabled = true; //true;
              b.events.onInputDown.add(this.addTally, this);
              this.assignFishMovement(b);
          }

    }


    addFishes(){

        var phaserJSON = this.game.cache.getJSON('fishpoints');
          //console.log(JSON.stringify(phaserJSON));


          var data = phaserJSON;
          var survey_string = "";
          var current_points = this.totalPoints;
          for(var i = 0; i < data.length; i++) {
              if(current_points >= data[i].points){

                //nemo
                if(data[i].name.valueOf() === "The clown fish")
                    this.animateClownFish();

                //if(data[i].name.valueOf() === "Puffer fish")
                //    this.animatePufferFish();

                //starfish
                if(data[i].name.valueOf() === "Star fish")
                    this.animateStarFishes();

                //squid
                if(data[i].name.valueOf() === "Squid")
                    this.animateSquid();

                if(data[i].name.valueOf() === "Gold fish")
                    this.animateGoldFish();

                if(data[i].name.valueOf() === "Octopus")
                    this.animateOctpus();

                if(data[i].name.valueOf() === "Angel fish")
                    this.animateAngelFish();

                if(data[i].name.valueOf() === "Crab")
                    this.animateCrab();

                if(data[i].name.valueOf() === "Carp fish")
                    this.animateGreenFish();

                if(data[i].name.valueOf() === "Electric fish")
                    this.animatePurpleFish();

                if(data[i].name.valueOf() === "Discus fish")
                    this.animateDiscusFish();

                if(data[i].name.valueOf() === "Betta fish")
                    this.animateBettaFish();               

                if(data[i].name.valueOf() === "Sea horse")
                    this.animateSeaHorse();

                if(data[i].name.valueOf() === "Butterfly fish")
                    this.animateButterflyFish();

                if(data[i].name.valueOf() === "Puffer fish")
                    this.animatePufferFish();

                if(data[i].name.valueOf() === "Tiger barb")
                    this.animateTigerbarb();

                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();

              }
          }

          //set the progres bar
          this.previoous_fish_point = 0;
          this.next_fish_point = 0;
          for(var i = 0; i < data.length; i++) {
              if(current_points < data[i].points){
                this.next_fish_point = data[i].points;
                break;
              }else{
                this.previoous_fish_point = data[i].points;
              }
          }
          

    }  

    animateClownFish(){
        this.clownFish = this.add.sprite(-100, 253, 'clownfish');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 30, true);
        this.clownFish.scale.setTo(0.5, 0.5);
        this.clownFish.name = "clownFish";
        this.gobothways(this.clownFish);
    }


    animateSquid(){    
        //squid
        var squid = this.add.sprite(- 120, this.height-150, 'squid');
        squid.animations.add('swim');
        squid.animations.play('swim', 5, true);
        squid.scale.setTo(0.25, 0.25);
        this.gobothways(squid);
    }

    
    animateButterflyFish(){
        //angel
        var butterflyFish = this.add.sprite(-100, this.height-300, 'butterflyfish');
        butterflyFish.animations.add('swim');
        butterflyFish.animations.play('swim', 10, true);
        butterflyFish.scale.setTo(0.5, 0.5);
        this.gobothways(butterflyFish);    
    }

    animateTigerbarb(){    
        //
        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        var tigerbarbfish = this.add.sprite(-100, this.height-120, 'tigerbarb');
        tigerbarbfish.animations.add('swim');
        tigerbarbfish.animations.play('swim', 10, true);
        tigerbarbfish.scale.setTo(0.6, 0.6);
        this.gobothways(tigerbarbfish); 
    }

    animatePufferFish(){    
        //
        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        var pufferfish = this.add.sprite(-100, 60, 'puffer');
        pufferfish.animations.add('swim');
        pufferfish.animations.play('swim', 10, true);
        pufferfish.scale.setTo(0.5, 0.5);
        this.gobothways(pufferfish); 
    }

    animateSquid(){
        //squid
        var squid = this.add.sprite(- 120, this.height-190, 'squid');
        squid.animations.add('swim');
        squid.animations.play('swim', 5, true);
        squid.scale.setTo(0.19, 0.19);
        this.gobothways(squid);

    }


    animateAngelFish(){

        //angel
        var angelfish = this.add.sprite(-100, this.height-260, 'angelfish');
        angelfish.animations.add('swim');
        angelfish.animations.play('swim', 10, true);
        angelfish.scale.setTo(0.4, 0.4);
        this.gobothways(angelfish);

    }


    animateDiscusFish(){

        //
        var discusfish = this.add.sprite(-100, this.height-150, 'discusfish');
        discusfish.animations.add('swim');
        discusfish.animations.play('swim', 15, true);
        discusfish.scale.setTo(0.4, 0.4);
        this.gobothways(discusfish);

    }


    animateBettaFish(){

        //
        var bettafish = this.add.sprite(this.CANVAS_WIDTH-150, this.height-130, 'bettafish');
        bettafish.animations.add('swim');
        bettafish.animations.play('swim', 5, true);
        bettafish.scale.setTo(0.25, 0.25);


    }


    animateClownFish(){
        //
        this.clownFish = this.add.sprite(-100, 253, 'clownfish');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 30, true);
        this.clownFish.scale.setTo(0.35, 0.35);
        this.clownFish.name = "clownFish";
        this.gobothways(this.clownFish);

    }


    animateGoldFish(){
        //goldfish
        var goldfish = this.add.sprite(this.CANVAS_WIDTH+100, 193, 'goldfish');
        goldfish.animations.add('swim');
        goldfish.animations.play('swim', 10, true);
        goldfish.scale.setTo(0.27, 0.27);
        this.gobothways(goldfish);

    }


    animateGreenFish(){
        var greenFish = this.add.sprite(this.CANVAS_WIDTH + 100, 153, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.2, 0.2);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);


    }


    animateSeaHorse(){

        var seahorse = this.add.sprite(this.CANVAS_WIDTH-60, 150, 'seahorseyellow');
        seahorse.animations.add('swim');
        seahorse.animations.play('swim', 10, true);
        //seahorse.anchor.setTo(0.5, 0.5);
        seahorse.scale.setTo(0.08, 0.08);


    }


    animateOctpus(){
        var octopus = this.add.sprite(40, 200, 'octopus');
        octopus.animations.add('swim');
        octopus.animations.play('swim', 30, true);
        octopus.scale.setTo(0.2, 0.2);
        this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    }


    animatePurpleFish(){

        var purpleFish = this.add.sprite(-100, 103, 'seacreatures');
        purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
        purpleFish.animations.play('swim');
        purpleFish.anchor.setTo(.5,.5);
        purpleFish.scale.setTo(0.5, 0.5);
        purpleFish.name = "purplefish";
        //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
        this.gobothways(purpleFish);


    }


    animateCrab(){
        var crab = this.add.sprite(190, this.height-50, 'seacreatures');
        crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
        crab.animations.play('swim');
        crab.scale.setTo(0.52, 0.52);

    }




    animateStarFishes(){
        //
        var redstarfish = this.add.sprite(30, this.height-28+7, 'redstarfish');
        redstarfish.animations.add('swim');
        redstarfish.animations.play('swim', 2, true);
        redstarfish.anchor.setTo(0.5,0.5);
        redstarfish.angle -= 20;
        redstarfish.scale.setTo(0.07, 0.07);

        var bluestarfish = this.add.sprite(70, this.height-22+7, 'bluestarfish');
        bluestarfish.animations.add('swim');
        bluestarfish.animations.play('swim', 1, true);
        bluestarfish.anchor.setTo(0.5,0.5);
        bluestarfish.angle -= 0;
        bluestarfish.scale.setTo(0.04, 0.04);


        var greenstarfish = this.add.sprite(170, this.height-22+7, 'greenstarfish');
        greenstarfish.animations.add('swim');
        greenstarfish.animations.play('swim', 5, true);
        greenstarfish.anchor.setTo(0.5,0.5);
        greenstarfish.angle +=10;
        greenstarfish.scale.setTo(0.04, 0.04);


    }


    gobothways(b){

        var change_amount = Math.floor(this.rnd.realInRange(0, 150));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        var pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.height) || (pos_y < 70)){
            pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }

        var t, X, Y;
        if(b.x > this.CANVAS_WIDTH){ 
            b.scale.x = -1*b.scale.x;
            X = -100+Math.floor(this.rnd.realInRange(0, 50));
            t= this.add.tween(b).to({ x: X, y: pos_y}, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            b.scale.x = -1*b.scale.x;
            X = this.CANVAS_WIDTH + 100 - Math.floor(this.rnd.realInRange(0, 50));
            t = this.add.tween(b).to({ x: X, y: pos_y }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
    }



    stopFish(b) {
        this.gobothways(b);
    }

    assignFishMovement(b) {
        xposition = Math.floor(this.rnd.realInRange(-100, this.world.width+100));
        yposition = Math.floor(this.rnd.realInRange(50, this.world.height-150));
        bdelay = 0; 
        if(xposition < b.x){
            b.scale.x = -1;
        }else{
            b.scale.x = 1;
        }
        b.animations.add('swim');
        b.animations.play('swim', 30, true);
        t = this.add.tween(b).to({x:xposition, y:yposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onComplete.add(this.stopFish, this);
    }

    yourGamePausedFunc(){
        console.log("Game paused");
        if(this.game.lockRender == false) 
            this.game.lockRender = true;
    }

    yourGameResumedFunc(){
        console.log("Game resumed");
        if(this.game.lockRender == true) 
            this.game.lockRender = false;
    }

    showunlockables(){
        console.log('treasure box clicked');
        this.componentObject.goToRewardsPage();
    }

    showInforBox(text){
        //console.log('treasure box clicked');
        this.componentObject.showInfoModal(text);
    }

    logdata() {
        console.log('show surveys');
        this.componentObject.goToSurveyPage();
    }

    update(){
    }

    assignscope(componentObject){
        this.componentObject = componentObject;
    }

	setTotalPoints(totalPoints){
		this.totalPoints = totalPoints;
	}    
}