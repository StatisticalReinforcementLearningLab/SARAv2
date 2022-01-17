export class SeaLevelL3 extends Phaser.State {
    //componentObject;
    constructor(){
        super();
        this.componentObject;
        this.surveyHistory = [];
    }
    
    create() {
        this.gameover = false;
        this.totalClicks = 0;
        //this.totalPoints = this.ionic_scope.total_points;
        //this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);
        
        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        this.buildWorld();


        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;
    }
    
    buildWorld() {
        //this.height = window.innerHeight-44;
        this.height = this.game.height;
        var undersea = this.add.image(0, 0, 'undersea');
        undersea.scale.setTo(0.8, 0.8);

        //coral
        

        undersea.x = -200;
        undersea.y = 0;
        undersea.height = this.game.height;
        undersea.width = this.game.width*5;

        //add water
        //this.addWater();
        
        //
        //this.add.sprite(5, 40, 'timer', 1);


        //
        /*
        var fish_progress = this.add.image(175,50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
        */



        //
        var treasure = this.add.image(35, this.height-100, 'treasuresea');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);
        treasure.angle += 10;


        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);

        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //
        /*
        var fishtank = this.add.image(5, 100, 'first_aq');
        fishtank.scale.setTo(0.2, 0.2);
        fishtank.inputEnabled = true;
        fishtank.events.onInputDown.add(this.earlyaquarium, this);
        */
       
        /*
        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);
        */

        //this.buildFish();
        this.buildAquarium();

        this.showProgressBars();

        //
        /*
        var meme = this.add.image(window.innerWidth - 140, 1, 'meme');
        meme.scale.setTo(0.3, 0.3);
        meme.inputEnabled = true;
        meme.events.onInputDown.add(this.showBubbles, this);
        */

        //
        /*
        var journal = this.add.image(this.CANVAS_WIDTH - 70, 1, 'fish_journal');
        journal.scale.setTo(0.5, 0.5);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);
        */


        //add bubbles
        //this.showBubbles();

        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);
        //this.game.onResume.add(yourGameResumedFunc, this);

        //
        /*
        var banner_shown = window.localStorage['banner_shown_2'] || "0";// = 1;
        if(banner_shown==="0")
            this.showBanner();
        */

        this.isPaused = false;

        //this.checkReinforcement();
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

        var SCALING_FACTOR = 0.8;

        //streak_info
        var streak_info = this.add.image(5, 5, 'streak_info');
        streak_info.scale.setTo(.30*SCALING_FACTOR, .30*SCALING_FACTOR);

        /*
        var info_level_streak = this.add.sprite(2 + streak_info.width + 12, 20, 'info_sprite');
        info_level_streak.animations.add('swim');
        info_level_streak.animations.play('swim', 1, true);
        info_level_streak.scale.setTo(0.3*SCALING_FACTOR, 0.3*SCALING_FACTOR);
        info_level_streak.anchor.setTo(.5,.5);
        info_level_streak.inputEnabled = true;
        info_level_streak.events.onInputDown.add(function(){this.showInforBox("Streak progress bar clicked")}, this); 
        */

        var colors = []; //['grey','grey','grey','grey','grey','grey','grey'];
        for(var i=0; i < this.surveyHistory.length; i++){
            if(this.surveyHistory[i] == 1)
                colors[i] = 'green';
            else
                colors[i] = 'grey';
        }   
        colors = colors.reverse()
        
        //console.log("this.surveyHistory " + this.surveyHistory);
        console.log("colors " + colors);
        //colors = ['green','green','green','green','grey','green','grey'];
        var streak_tile;
        for(var i=0; i < this.surveyHistory.length; i++){
            streak_tile = this.add.image(32 + i*12, 10, 'streak_' + colors[i]);
            streak_tile.scale.setTo(.15*4*SCALING_FACTOR, .27*4*SCALING_FACTOR);
        }


        //------ Right side
        //var progressBars = this.add.group();

        //points bar
        vertical_position_offset = 13;
        var points_progress = this.add.image(this.CANVAS_WIDTH, 2, 'points_progress_2');
        points_progress.scale.setTo(.36*SCALING_FACTOR, .30*SCALING_FACTOR);
        points_progress.anchor.setTo(1,0);
        //progressBars.add(points_progress);

        //point text
        var points_text = this.add.text(this.CANVAS_WIDTH - 60, 8, "" + this.totalPoints, {font:"20px dumbo_regular", fill:"#4c3d01"});
        points_text.anchor.setTo(0.5,0);
        points_text.scale.setTo(SCALING_FACTOR, SCALING_FACTOR);
        //progressBars.add(points_text);

        var star_icon = this.add.image(this.CANVAS_WIDTH-16, vertical_position_offset+4, 'star_point');
        star_icon.scale.setTo(SCALING_FACTOR, SCALING_FACTOR);
        star_icon.anchor.setTo(.5, .5);
        //progressBars.add(points_text);

        //progressBars.scale.setTo(.8, .8);

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
        var vertical_position_offset = 35;

        
        var progress_bar_fish =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_grey', 1);
        progress_bar_fish.anchor.setTo(1,0);
        progress_bar_fish.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

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
        progress_sprite.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

        var fish_progress_icon = this.add.image(this.CANVAS_WIDTH-16, vertical_position_offset+8, 'next_fish_icon');
        fish_progress_icon.scale.setTo(.2*0.8*SCALING_FACTOR, .2*0.8*SCALING_FACTOR);
        fish_progress_icon.anchor.setTo(.5, .5);
        

        
        //points to get to meme.
        vertical_position_offset = 57;

        /*
        var progress_bar_memes =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_yellow', 1);
        progress_bar_memes.anchor.setTo(1,0);
        progress_bar_memes.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

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
        progress_sprite.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

        var meme_icon = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+10, 'meme_icon');
        meme_icon.scale.setTo(.52*0.8*SCALING_FACTOR, .52*0.8*SCALING_FACTOR);
        meme_icon.anchor.setTo(.5, .5);


        //points to get to alt message.
        var vertical_position_offset = 79;
        var progress_bar_altruism_message =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer', 1);
        progress_bar_altruism_message.anchor.setTo(1,0);
        progress_bar_altruism_message.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

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
        progress_sprite.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

        
        var alt_icon = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+12, 'alt_icon');
        alt_icon.scale.setTo(.12*0.8*SCALING_FACTOR, .12*0.8*SCALING_FACTOR);
        alt_icon.anchor.setTo(.5, .5);
        


        //points to get to level up.
        var vertical_position_offset = 101;
        */


        var progress_bar_level_up =  this.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_pumpkin', 1);
        progress_bar_level_up.anchor.setTo(1,0);
        progress_bar_level_up.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

        // end of level is 1060, start is at 0
        var start_point_for_level = 1060;
        var end_point_for_level = 2120;
        progress_sprite = this.game.add.sprite(this.CANVAS_WIDTH-15, vertical_position_offset+5, 'timer_pumpkin', 0);
        rect = new Phaser.Rectangle(0, 0, 0, progress_sprite.height);
        percent = (current_points-start_point_for_level)/(end_point_for_level-start_point_for_level);
        percent = percent*0.8 + 0.2;
        //console.log("" + current_points + "," + this.previoous_fish_point + "," + this.next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * progress_sprite.width);
        //console.log("Width, " + rect.width  + "," + progress_sprite.width);
        progress_sprite.crop(rect);
        progress_sprite.anchor.setTo(1,0);
        progress_sprite.scale.setTo(0.8*SCALING_FACTOR,0.5*SCALING_FACTOR);

        var level_up_2 = this.add.image(this.CANVAS_WIDTH-18, vertical_position_offset+12, 'level_up_2');
        level_up_2.scale.setTo(.12*0.9*SCALING_FACTOR, .12*0.9*SCALING_FACTOR);
        level_up_2.anchor.setTo(.5, .5);






        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);
        //console.log("countdown.width " + this.countdown.width);

        
    }

    setSurveyHistory(survey_history){
        console.log("survey_history " + survey_history + ", length: " + survey_history.length);
        //this.surveyHistory = survey_history;
        for(var i=0; i<survey_history.length; i++)
            this.surveyHistory.push(survey_history[i]);

        //console.log("setSurveyHistory function finished");
    }

    showInforBox(text){
        //console.log('treasure box clicked');
        this.componentObject.showInfoModal(text);
    }

    //show the reward
    checkReinforcement(){
        this.ionic_scope.$emit('show:checkReinforcement',this.ionic_scope);
    }

    showBanner(){
        this.banner_object = this.add.group();
        //--- banner
        var banner = this.add.image(0, this.height-180, 'banner');
        banner.scale.setTo(.6, .75);
        banner.inputEnabled = true;
        //banner.events.onInputDown.add(this.hideBanner, this);
        this.banner_object.add(banner);
        banner.events.onInputDown.add(this.hideBanner, this);

        var banner_fish = this.add.image(260, this.height-190, 'banner_fish');
        banner_fish.scale.setTo(.55, .55);
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


    yourGamePausedFunc(){
        console.log("Game paused");
        //this.isPaused = true;
        if(this.game.lockRender == false) 
            this.game.lockRender = true;
        //this.filter.destroy();
        //this.sprite.destroy();
    }

    yourGameResumedFunc(){
        console.log("Game resumed");
        //this.addWater();
        //this.isPaused = false;
        if(this.game.lockRender == true) 
            this.game.lockRender = false;
    }

    changebadgecount(badge_count){
        //console.log("Game resumed");
        this.badgecount.setText('' + badge_count);
    }

    addWater(){
        //  From http://glslsandbox.com/e#16153.0
        var fragmentSrc = [

            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform vec2      mouse;",

            "#define MAX_ITER 2",

            "void main( void )",
            "{",
                "vec2 v_texCoord = gl_FragCoord.xy / resolution;",

                "vec2 p =  v_texCoord * 8.0 - vec2(1.0);",
                "vec2 i = p;",
                "float c = 1.0;",
                "float inten = .2;",

                "for (int n = 0; n < MAX_ITER; n++)",
                "{",
                    "float t = time * (1.0 - (3.0 / float(n+1)));",

                    "i = p + vec2(cos(t - i.x) + sin(t + i.y),",
                    "sin(t - i.y) + cos(t + i.x));",

                    "c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),",
                    "p.y / (cos(i.y+t)/inten)));",
                "}",

                "c /= float(MAX_ITER);",
                "c = 1.5 - sqrt(c);",

                "vec4 texColor = vec4(0.0, 0.005, 0.02, 0.1);",

                "texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));",

                "gl_FragColor = texColor;",
            "}"
        ];

        this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
        this.filter.setResolution(this.game.height, this.game.width);

        this.sprite = this.add.sprite();
        this.sprite.width = this.game.width;
        this.sprite.height = this.game.height;

        this.sprite.filters = [ this.filter ];
    }

    update() {
        //console.log("coming here");
        //if(this.isPaused == false)
        //    this.filter.update(this.game.input.activePointer);
    }

    showmemes() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        this.ionic_scope.$emit('reward:meme', this.ionic_scope);
        //console.log("Came here");
    }

    logdata() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");
        this.componentObject.goToSurveyPage();
    }

    earlyaquarium() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");

        this.state.start('Gamelast');
    }

    //update the connected and disconnected things
    updateconnectivity(state) {
        //console.log("Is connected: " +  state);
        this.active_task_connected.visible = state;
    }

    assignscope(scope) {
        this.ionic_scope = scope;
    }

    showBubbles2(){
        //add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(-100, 303, 'submarine_at');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 25, true);
        blackdiver.scale.setTo(1.3, 1.3);
        var t = this.add.tween(blackdiver).to({ x: this.world.centerX}, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(this.addBubbles2, this);
        
    }

    addBubbles2(){    
        var delay = 0;
        for (var i = 0; i < 100; i++)
        {
            var sprite = this.add.sprite(-100 + (this.world.randomX), this.height+100, 'ball');
            sprite.scale.set(this.rnd.realInRange(0.3, 0.6));
            var speed = this.rnd.between(1000, 2000);
            var tween = this.add.tween(sprite);
            tween.to({y: -256}, speed, Phaser.Easing.Sinusoidal.In, true, delay, 0, false);
            delay += 100;

            if(i==0)
                tween.onComplete.add(this.checkLastBubble2, this);

            if(i>2)
                delay += 100;
                //this.checkLastBubble(sprite);
        }
    }

    checkLastBubble2(b) {
        /*
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }
        */

        //
        var graphics = this.add.graphics(0,50);
        graphics.lineStyle(0);
        graphics.beginFill(0x006622, 0.8);
        graphics.drawRect(0, 0, this.game.width, this.game.height-100);
        graphics.endFill();

        //  Apply the shadow to the Stroke only
        //text2.setShadow(2, 2, "#E65100", 2, true, false);

        //you earned a reward
        var pirate = this.add.image(this.game.width-145, 100, 'pirate');
        //pirate.anchor.setTo(-0.3, 1.4);
        pirate.scale.setTo(0.7, 0.7);

        //
        var text3 = this.add.text(10, 60, "An extra gift\ntoday", { font: "35px Arial Black", fill: "#b33e00" });
        text3.stroke = "#FFE0B2";
        text3.strokeThickness = 4;

        //
        var text1 = this.add.text(10, 160, "for completing\nactive tasks", { font: "24px Arial Black", fill: "#b33e00" });
        text1.stroke = "#FFE0B2";
        text1.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text1.setShadow(2, 2, "#E65100", 2, true, false);


        //
        var text2 = this.add.text(10, this.game.height-130, "Click on the gift\nto open", { font: "24px Arial Black", fill: "#FFE0B2" });
        text2.stroke = "#FFE0B2";
        text2.strokeThickness = 0;
        //  Apply the shadow to the Stroke only
        //text2.setShadow(2, 2, "#E65100", 2, true, false);

        //
        var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'gift');
        sprite.anchor.setTo(0.9, 0.2);
        sprite.scale.setTo(0.35,0.35);
        sprite.alpha = 0;
        this.add.tween(sprite).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(this.showReward, this);
        

        //
        console.log("don't know " + b.y);
    }

    showBubbles(){
        //add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(this.CANVAS_WIDTH+100, 303, 'submarine');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 30, true);
        blackdiver.scale.setTo(-1.3, 1.3);
        var t = this.add.tween(blackdiver).to({ x: this.world.centerX+20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(this.addBubbles, this);
    }

    addBubbles(){    
        var delay = 0;
        for (var i = 0; i < 100; i++)
        {
            var sprite = this.add.sprite(-100 + (this.world.randomX), this.height+100, 'ball');
            sprite.scale.set(this.rnd.realInRange(0.3, 0.6));
            var speed = this.rnd.between(1000, 2000);
            var tween = this.add.tween(sprite);
            tween.to({y: -256}, speed, Phaser.Easing.Sinusoidal.In, true, delay, 0, false);
            delay += 100;

            if(i==0)
                tween.onComplete.add(this.checkLastBubble, this);

            if(i>2)
                delay += 100;
                //this.checkLastBubble(sprite);
        }
    }

    checkLastBubble(b) {
        /*
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }
        */

        //
        var graphics = this.add.graphics(0,50);
        graphics.lineStyle(0);
        graphics.beginFill(0x0288D1, 0.8);
        graphics.drawRect(0, 0, this.game.width, this.game.height-100);
        graphics.endFill();

        //  Apply the shadow to the Stroke only
        //text2.setShadow(2, 2, "#E65100", 2, true, false);

        //you earned a reward
        var pirate = this.add.image(this.game.width-145, 100, 'pirate');
        //pirate.anchor.setTo(-0.3, 1.4);
        pirate.scale.setTo(0.7, 0.7);

        //
        var text3 = this.add.text(10, 60, "An extra gift\ntoday", { font: "35px Arial Black", fill: "#b33e00" });
        text3.stroke = "#FFE0B2";
        text3.strokeThickness = 4;

        //
        var text1 = this.add.text(10, 160, "for filling out\nthe survey", { font: "24px Arial Black", fill: "#b33e00" });
        text1.stroke = "#FFE0B2";
        text1.strokeThickness = 2;
        //  Apply the shadow to the Stroke only
        text1.setShadow(2, 2, "#E65100", 2, true, false);


        //
        var text2 = this.add.text(10, this.game.height-130, "Click on the gift\nto open", { font: "24px Arial Black", fill: "#FFE0B2" });
        text2.stroke = "#FFE0B2";
        text2.strokeThickness = 0;

        
        

        //
        var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'gift');
        sprite.anchor.setTo(0.9, 0.2);
        sprite.scale.setTo(0.35,0.35);
        sprite.alpha = 0;
        this.add.tween(sprite).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(this.showReward, this);
        

        //
        console.log("don't know " + b.y);
    }

    //show the reward
    showReward(){
        this.ionic_scope.$emit('show:reinforcement',this.ionic_scope);
    }


    buildAquarium() {

        ////////////////////////////////////////////////////////////
        //upper aquarium
        ////////////////////////////////////////////////////////////

        /*
        this.sharkfish = this.add.sprite(window.innerWidth + 100, 70, 'sharkswim');
        this.sharkfish.anchor.setTo(.5,.5);
        this.sharkfish.animations.add('swim');
        this.sharkfish.animations.play('swim',10, true);
        this.sharkfish.scale.setTo(0.3, 0.22);
        this.sharkfish.name = "sharkswim";
        this.gobothways(this.sharkfish);

        //swordfish
        this.swordfish = this.add.sprite(-150, 120, 'swordfish');
        this.swordfish.anchor.setTo(.5,.5);
        this.swordfish.animations.add('swim');
        this.swordfish.animations.play('swim',30, true);
        this.swordfish.scale.setTo(0.3, 0.3);
        this.swordfish.name = "swordfishswim";
        this.gobothways(this.swordfish);

        this.dolphin = this.add.sprite(-150, 180, 'dolphin');
        this.dolphin.anchor.setTo(.5,.5);
        this.dolphin.animations.add('swim');
        this.dolphin.animations.play('swim',10, true);
        this.dolphin.scale.setTo(0.6, 0.6);
        this.dolphin.name = "dolphinswim";
        this.dolphin.angle -= 3;
        this.gobothways(this.dolphin);
        */

        var phaserJSON = this.game.cache.getJSON('fishpoints');

        ////////////////////////////////////////////////////////////
        //upper aquarium
        ////////////////////////////////////////////////////////////
        var data = phaserJSON;
        var survey_string = "";
        var current_points = this.totalPoints;
        for(var i = 0; i < data.length; i++) {
            if(current_points >= data[i].points){

                //nemo
                if(data[i].name.valueOf() === "Blue tang")
                    this.addDori();


                //starfish
                if(data[i].name.valueOf() === "Jelly fish")
                    this.addJellyFish();

                //squid
                if(data[i].name.valueOf() === "Green Crab")
                    this.addCrab();


                if(data[i].name.valueOf() === "Achovies")
                    this.addAnchovies();

                if(data[i].name.valueOf() === "Bubbles")
                    this.addYellowTang();

                if(data[i].name.valueOf() === "Salmon")
                    this.addSalmon();

                if(data[i].name.valueOf() === "Deep undersea fish")
                    this.addAngryFish();



                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();
            }
        }

        this.addCoral();

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

        /*
          //console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point);
          this.progress_sprite = this.game.add.sprite(5, 40, 'timer', 0);
          var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);
          var percent = (current_points-previoous_fish_point)/(next_fish_point-previoous_fish_point);
          console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point + "," + percent);
          rect.width = Math.max(0, percent * this.progress_sprite.width);

          console.log("Width, " + rect.width  + "," + this.progress_sprite.width);
          this.progress_sprite.crop(rect);
        */

    }


    addAFish(added_point){

          var phaserJSON = this.game.cache.getJSON('fishpoints');
          //console.log(JSON.stringify(phaserJSON));


          var data = phaserJSON;
          var survey_string = "";
          var current_points = this.totalPoints;
          var old_points = current_points - added_point;
          console.log("" + current_points + ", " + old_points);
          for(var i = 0; i < data.length; i++) {
              if(current_points >= data[i].points && 
                    old_points < data[i].points){

                //nemo
                if(data[i].name.valueOf() === "Blue tang")
                    this.addDori();


                //starfish
                if(data[i].name.valueOf() === "Jelly fish")
                    this.addJellyFish();

                //squid
                if(data[i].name.valueOf() === "Green Crab")
                    this.addCrab();


                if(data[i].name.valueOf() === "Achovies")
                    this.addAnchovies();

                if(data[i].name.valueOf() === "Bubbles")
                    this.addYellowTang();

                if(data[i].name.valueOf() === "Salmon")
                    this.addSalmon();

                if(data[i].name.valueOf() === "Angry fish")
                    this.addAngryFish();


                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();

              }
          }

          //set the progres bar
          var previoous_fish_point = 0;
          var next_fish_point = 0;
          for(var i = 0; i < data.length; i++) {
              if(current_points < data[i].points){
                next_fish_point = data[i].points;
                break;
              }else{
                previoous_fish_point = data[i].points;
              }
          }
          //console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point);
          var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);
          var percent = (current_points-previoous_fish_point)/(next_fish_point-previoous_fish_point);
          console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point + "," + percent);
          this.progress_sprite = this.game.add.sprite(5, 40, 'timer', 0);
          rect.width = 1 * percent * this.progress_sprite.width;
          this.progress_sprite.crop(rect);

    }

    addDori() {        
        ////////////////////////////////////////////////////////////
        // mid aquarium
        ////////////////////////////////////////////////////////////
        /*
        if(this.totalPoints >= 1360){//means bubbles are available
            var dori = this.add.sprite(90, 100, 'dori');
            dori.animations.add('swim');
            dori.animations.play('swim', 10, true);
            dori.angle -= 10;
            dori.scale.setTo(0.5, 0.5);

            var nemo = this.add.sprite(75, 110, 'nemo');
            nemo.animations.add('swim');
            nemo.animations.play('swim', 7, true);
            nemo.angle += 10;
            nemo.scale.setTo(-0.5, 0.5);
        }else
        */
        {
            this.clownFish = this.add.sprite(-100, 283, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 10, true);
            this.clownFish.scale.setTo(0.5, 0.5);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);

            this.clownFish = this.add.sprite(-100, 218, 'dori');
            this.clownFish.anchor.setTo(.1,.1);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 10, true);
            this.clownFish.scale.setTo(0.5, 0.5);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }

    }

    addYellowTang() {  
        var yellowtang = this.add.sprite(this.CANVAS_WIDTH + 70, 120, 'yellowtang');
        yellowtang.animations.add('swim');
        yellowtang.animations.play('swim', 10, true);
        yellowtang.scale.setTo(0.45, 0.45);
        //yellowtang.angle -= 10;
        yellowtang.anchor.setTo(.5,.5);
        this.gobothways(yellowtang);
    }


    addJellyFish() {  

        //
        var jellyfish = this.add.sprite(this.CANVAS_WIDTH - 80, 100, 'jellyfish');
        jellyfish.animations.add('swim');
        jellyfish.animations.play('swim', 15, true);
        jellyfish.scale.setTo(0.25, 0.25);
        this.add.tween(jellyfish).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    }


    addSalmon() { 
        var salmon = this.add.sprite(-250, 370, 'salmon');
        salmon.animations.add('swim');
        salmon.animations.play('swim', 10, true);
        salmon.scale.setTo(0.4, 0.4);
        salmon.anchor.setTo(.5,.5);
        this.gobothways(salmon);


        ////////////////////////////////////////////////////////////
        // bottom aquarium
        ////////////////////////////////////////////////////////////

        //
        /*
        var whale = this.add.sprite(window.innerWidth+150, this.height-100, 'whale');
        whale.animations.add('swim');
        whale.animations.play('swim', 12, true);
        whale.scale.setTo(1.8, 1.8);
        whale.anchor.setTo(.5,.5);
        whale.angle += 5;
        whale.name = "whaleswim";
        this.gobothways(whale);
        */

    }


    addCrab() { 
        var redcrab = this.add.sprite(this.CANVAS_WIDTH-30, this.height-105, 'redcrab');
        redcrab.animations.add('swim');
        redcrab.animations.play('swim', 15, true);
        redcrab.scale.setTo(-0.3, 0.3);

        //
        var greencrab = this.add.sprite(this.CANVAS_WIDTH-240, this.height-85, 'greencrab');
        greencrab.animations.add('swim');
        greencrab.animations.play('swim', 15, true);
        greencrab.scale.setTo(0.3, 0.3);

        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);
    }



        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);

    addAngryFish() { 
        this.angryfish = this.add.sprite(-100, this.height-150, 'angryfish');
        this.angryfish.anchor.setTo(1.2,.5);
        this.angryfish.animations.add('swim');
        this.angryfish.animations.play('swim',20, true);
        this.angryfish.scale.setTo(0.4, 0.4);
        this.angryfish.name = "angryfishswim";
        this.gobothways(this.angryfish);


    }

    addAnchovies() { 
        //
        this.blueanchovy = this.add.sprite(-100, this.height-250, 'blueanchovy');
        this.blueanchovy.anchor.setTo(.9,.9);
        this.blueanchovy.animations.add('swim');
        this.blueanchovy.animations.play('swim',4, true);
        this.blueanchovy.scale.setTo(0.18, 0.18);
        this.blueanchovy.name = "blueanchovyswim";
        this.gobothways(this.blueanchovy);

        this.greenanchovy = this.add.sprite(-100, this.height-235, 'greenanchovy');
        this.greenanchovy.anchor.setTo(.5,.5);
        this.greenanchovy.animations.add('swim');
        this.greenanchovy.animations.play('swim',8, true);
        this.greenanchovy.scale.setTo(0.13, 0.13);
        this.greenanchovy.name = "greenanchovyswim";
        this.gobothways(this.greenanchovy);

        this.pinkanchovy = this.add.sprite(-100, this.height-270, 'pinkanchovy');
        this.pinkanchovy.anchor.setTo(.2,.2);
        this.pinkanchovy.animations.add('swim');
        this.pinkanchovy.animations.play('swim',2, true);
        this.pinkanchovy.scale.setTo(0.21, 0.21);
        this.pinkanchovy.name = "pinkanchovyswim";
        this.gobothways(this.pinkanchovy);

    }
    

    addCoral() { 
        //
        var coral = this.add.image(0, this.height-90, 'coral');
        coral.scale.setTo(0.7, 0.7);
   
    }

    showunlockables(){
        console.log('treasure box clicked');
        this.componentObject.goToRewardsPage();
    }

    gobothways(b){
        //console.log('start again ' + b.name);

        //if()
        /*
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            t = this.add.tween(b).to({ x: window.innerWidth + 100 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        */

        var change_amount = Math.floor(this.rnd.realInRange(0, 50));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        var pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.height) || (pos_y < 70)){
            pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }


        var t;
        //if()
        if(b.x > this.CANVAS_WIDTH){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            //t= this.add.tween(b).to({ x: -200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t= this.add.tween(b).to({ x: -100+Math.floor(this.rnd.realInRange(0, 50)), y: pos_y }, 7500 + Math.floor(this.rnd.realInRange(0, 4000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            //t = this.add.tween(b).to({ x: window.innerWidth + 200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t = this.add.tween(b).to({ x: this.CANVAS_WIDTH + 100 - Math.floor(this.rnd.realInRange(0, 50)), y: pos_y }, 7500 + Math.floor(this.rnd.realInRange(0, 4000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }

        //if()
        /*
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            //t= this.add.tween(b).to({ x: -200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t= this.add.tween(b).to({ x: -100 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            //t = this.add.tween(b).to({ x: window.innerWidth + 200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t = this.add.tween(b).to({ x: window.innerWidth + 100 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }*/
    } 
    
    buildFish() {
        
        //assign number of fish
        numfish = 5;
        //assign type and age of fish
        var fishType = ["green4", "horse4", "purple4", "pink4", "magenta4"]
        this.fishGroup = this.add.group();
        this.fishGroup.enableBody = true;
        for(i = 0; i < numfish; i++){
            var b = this.fishGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.integerInRange(this.world.height-300, this.world.height-200), fishType[i]);
            b.scale.setTo(0.4, 0.8);
            b.anchor.setTo(0.5, 0.5);
            b.body.moves = false;
            b.inputEnabled = true;
            b.events.onInputDown.add(this.addTally, this);
            this.assignFishMovement(b);
        }

    }
    
    assignFishMovement(b) {
        xposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
        yposition = Math.floor(this.rnd.realInRange(100, this.world.height-200));
        bdelay = this.rnd.integerInRange(2000, 6000);
        if(xposition < b.x){
            b.scale.x = -1;
        }else{
            b.scale.x = 1;
        }
        t = this.add.tween(b).to({x:xposition, y:yposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onComplete.add(this.stopFish, this);
    }
    
    stopFish(b) {
        //this.assignFishMovement(b);
        this.gobothways(b);
    }
    
    addTally() {
        this.totalClicks = this.totalClicks + 1;
        this.countdown.setText('Fishes Fed: ' + this.totalClicks);
    }

    updatescore (added_points) {
        console.log("Update score called inside game, " + this.ionic_scope.total_points);
        this.totalPoints = this.ionic_scope.total_points;
        this.addAFish(added_points);
        this.countdown.setText('Points: ' + this.totalPoints);
    }

    setTotalPoints(totalPoints){
		this.totalPoints = totalPoints;
    }
    
    assignscope(componentObject){
        this.componentObject = componentObject;
    }
}