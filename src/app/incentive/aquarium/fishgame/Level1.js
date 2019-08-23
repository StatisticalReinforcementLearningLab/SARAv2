FishGame.Level1 = function(game) {
    this.totalClicks;
    this.totalPoints;
    this.fishGroup;
    this.gameover;
    this.overmessage;
    this.music;
    this.game = game;
    this.ionic_scope;
    this.progress_sprite;
    this.prgress_bar_width;
    this.banner_object;
    this.CANVAS_WIDTH;
    this.badgecount;
};

FishGame.Level1.prototype = {
    
    create: function() {
        this.gameover = false;
        this.totalClicks = 0;
        this.totalPoints = this.ionic_scope.total_points;
        //this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);
        
        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        this.buildWorld();


        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;
    },
    
    buildWorld: function() {
        this.height = this.game.height;
        var undersea = this.add.image(0, 0, 'undersea');
        undersea.scale.setTo(0.8, 0.8);

        //coral
        undersea.x = -200;
        undersea.y = 0;
        undersea.height = this.game.height;
        undersea.width = this.game.width*5;

        //
        this.add.sprite(5, 40, 'timer', 1);


        //
        var fish_progress = this.add.image(175,50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
        

        var treasure = this.add.image(35, this.height-80, 'treasuresea');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);
        treasure.angle += 10;

        //
        this.active_task_connected = this.add.image(10, 40, 'disconnected');
        this.active_task_connected.set
        this.active_task_connected.scale.setTo(0.15, 0.15);
        this.active_task_connected.inputEnabled = true;
        this.active_task_connected.events.onInputDown.add(this.logdata, this);
        this.active_task_connected.visible = false;

        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //
        var fishtank = this.add.image(5, 100, 'first_aq');
        fishtank.scale.setTo(0.2, 0.2);
        fishtank.inputEnabled = true;
        fishtank.events.onInputDown.add(this.earlyaquarium, this);

        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);

        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);

        //this.buildFish();
        this.buildAquarium();

        //
        var journal = this.add.image(this.CANVAS_WIDTH - 70, 1, 'fish_journal');
        journal.scale.setTo(0.5, 0.5);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);


        

        //
        /*
        var meme = this.add.image(window.innerWidth - 140, 1, 'meme');
        meme.scale.setTo(0.3, 0.3);
        meme.inputEnabled = true;
        meme.events.onInputDown.add(this.showBubbles, this);
        */
        

        //text.anchor.set(0.5);

        //banner.inputEnabled = true;
        //banner.events.onInputDown.add(this.showBubbles, this);

        setTimeout(function () {
            //checkReinforcement();  

        }, 500);


        //
        // var banner_shown = window.localStorage['banner_shown'] || "0";// = 1;
        // if(banner_shown==="0")
        //     this.showBanner();
        // this.showBanner();

        //
        var banner_shown = window.localStorage['banner_shown_2'] || "0";// = 1;
        if(banner_shown==="0")
            this.showBanner();
        // 
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);

        this.checkReinforcement();
    },

    yourGamePausedFunc: function(){
        console.log("Game paused");
        //this.isPaused = true;
        this.game.lockRender = true;
        //this.filter.destroy();
        //this.sprite.destroy();
    },

    yourGameResumedFunc: function(){
        console.log("Game resumed");
        //this.addWater();
        //this.isPaused = false;
        this.game.lockRender = false;
    },

    changebadgecount: function(badge_count){
        console.log("Game resumed");
        this.badgecount.setText('' + badge_count);
    },

    earlyaquarium: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");

        this.state.start('Gamelast');
    },

    //show the reward
    checkReinforcement: function(){
        this.ionic_scope.$emit('show:checkReinforcement',this.ionic_scope);
    },

    showBanner: function(){
        this.banner_object = this.add.group();
        //--- banner
        var banner = this.add.image(00, this.height-180, 'banner');
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


    },

    hideBanner:function(elem){
        console.log("clicked");
        this.banner_object.destroy(true);
        window.localStorage['banner_shown_2'] = "1";
        //deleted all the elements
    },


    logdata: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");
    },

    //update the connected and disconnected things
    updateconnectivity: function(state) {
        //console.log("Is connected: " +  state);
        this.active_task_connected.visible = state;
    },

    assignscope: function(scope) {
        this.ionic_scope = scope;
    },


    showBubbles2: function(){
        //add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(-100, 303, 'submarine_at');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 25, true);
        blackdiver.scale.setTo(1.3, 1.3);
        var t = this.add.tween(blackdiver).to({ x: this.world.centerX}, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(this.addBubbles2, this);
        
    },

    addBubbles2: function(){    
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
    },

    checkLastBubble2: function(b) {
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
    },


    showBubbles: function(){
        //add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(this.CANVAS_WIDTH+100, 303, 'submarine');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 30, true);
        blackdiver.scale.setTo(-1.3, 1.3);
        var t = this.add.tween(blackdiver).to({ x: this.world.centerX+20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(this.addBubbles, this);
    },



    addBubbles: function(){    
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
    },

    checkLastBubble: function(b) {
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
    },

    //show the reward
    showReward: function(){
        this.ionic_scope.$emit('show:reinforcement',this.ionic_scope);
    },


    buildAquarium: function() {

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

                if(data[i].name.valueOf() === "Sword fish")
                    this.addSwordFish();

                if(data[i].name.valueOf() === "Shark")
                    this.addShark();

                if(data[i].name.valueOf() === "Dophin")
                    this.addDolphin();

                if(data[i].name.valueOf() === "Whale")
                    this.addWhale();

                if(data[i].name.valueOf() === "Stingray fish")
                    this.addKiteFish();


                //if(data[i].name.valueOf() === "Tiger barb")
                //    this.animateTigerbarb();
            }
        }

        this.addCoral();

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
          this.progress_sprite = this.game.add.sprite(5, 40, 'timer', 0);
          var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);
          var percent = (current_points-previoous_fish_point)/(next_fish_point-previoous_fish_point);
          console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point + "," + percent);
          rect.width = Math.max(0, percent * this.progress_sprite.width);

          console.log("Width, " + rect.width  + "," + this.progress_sprite.width);
          this.progress_sprite.crop(rect);
    },

    addAFish: function(added_point){

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

                if(data[i].name.valueOf() === "Sword fish")
                    this.addSwordFish();

                if(data[i].name.valueOf() === "Shark")
                    this.addShark();

                if(data[i].name.valueOf() === "Dophin")
                    this.addDolphin();

                if(data[i].name.valueOf() === "Whale")
                    this.addWhale();

                if(data[i].name.valueOf() === "Stingray fish")
                    this.addKiteFish();

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

    },

    
    addShark: function() {    
        this.sharkfish = this.add.sprite(this.CANVAS_WIDTH + 100, 130, 'sharkswim');
        this.sharkfish.anchor.setTo(.5,.5);
        this.sharkfish.animations.add('swim');
        this.sharkfish.animations.play('swim',10, true);
        this.sharkfish.scale.setTo(0.3, 0.22);
        this.sharkfish.name = "sharkswim";
        this.gobothways(this.sharkfish);
    },


    addSwordFish: function() {   
        //swordfish
        this.swordfish = this.add.sprite(-150, 70, 'swordfish');
        this.swordfish.anchor.setTo(-.5,.6);
        this.swordfish.animations.add('swim');
        this.swordfish.animations.play('swim',30, true);
        this.swordfish.scale.setTo(0.3, 0.3);
        this.swordfish.name = "swordfishswim";
        this.gobothways(this.swordfish);
    },


    addDolphin: function() {   
        this.dolphin = this.add.sprite(-150, 70, 'dolphin');
        this.dolphin.anchor.setTo(.9,.6);
        this.dolphin.animations.add('swim');
        this.dolphin.animations.play('swim',10, true);
        this.dolphin.scale.setTo(0.6, 0.6);
        this.dolphin.name = "dolphinswim";
        this.dolphin.angle -= 3;
        this.gobothways(this.dolphin);
    },

    addDori: function() {    
        ////////////////////////////////////////////////////////////
        // mid aquarium
        ////////////////////////////////////////////////////////////
        /*
        var dori = this.add.sprite(100, this.height/3 + 20, 'dori');
        dori.animations.add('swim');
        dori.animations.play('swim', 10, true);
        dori.scale.setTo(0.3, 0.3);
        dori.angle -= 10;
        dori.anchor.setTo(.5,.5);

        var nemo = this.add.sprite(35, this.height/3 + 20, 'nemo');
        nemo.animations.add('swim');
        nemo.animations.play('swim', 7, true);
        nemo.scale.setTo(-0.3, 0.3);
        nemo.angle += 10;
        nemo.anchor.setTo(.5,.5);
        */

        this.clownFish = this.add.sprite(-100, this.height/3 + 20, 'clownfish');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 10, true);
        this.clownFish.scale.setTo(0.3, 0.3);
        this.clownFish.name = "clownFish";
        this.gobothways(this.clownFish);

        this.clownFish = this.add.sprite(-100, this.height/3 + 20, 'dori');
        this.clownFish.anchor.setTo(.1,.1);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 10, true);
        this.clownFish.scale.setTo(0.3, 0.3);
        this.clownFish.name = "clownFish";
        this.gobothways(this.clownFish);

    },

    addYellowTang: function() {  
        var yellowtang = this.add.sprite(this.CANVAS_WIDTH+100, this.height/3 + 55, 'yellowtang');
        yellowtang.animations.add('swim');
        yellowtang.animations.play('swim', 10, true);
        yellowtang.scale.setTo(0.22, 0.22);
        //yellowtang.angle -= 10;
        yellowtang.anchor.setTo(.5,.5);
        this.gobothways(yellowtang);
    },


    addJellyFish: function() {  
        //
        var jellyfish = this.add.sprite(this.CANVAS_WIDTH - 80, this.height/3 + 0, 'jellyfish');
        jellyfish.animations.add('swim');
        jellyfish.animations.play('swim', 15, true);
        jellyfish.scale.setTo(0.12, 0.12);
        this.add.tween(jellyfish).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
    },


    addSalmon: function() { 
        /*
        var salmon = this.add.sprite(window.innerWidth - 100, this.height/3 + 70, 'salmon');
        salmon.animations.add('swim');
        salmon.animations.play('swim', 10, true);
        salmon.scale.setTo(0.2, 0.2);
        salmon.anchor.setTo(.5,.5);
        this.gobothways(salmon);
        */

        var yellowtang = this.add.sprite(-150, this.height/3 + 70, 'salmon');
        yellowtang.animations.add('swim');
        yellowtang.animations.play('swim', 10, true);
        yellowtang.scale.setTo(0.2, 0.2);
        //yellowtang.angle -= 10;
        yellowtang.anchor.setTo(.5,.5);
        this.gobothways(yellowtang);
    },

        ////////////////////////////////////////////////////////////
        // bottom aquarium
        ////////////////////////////////////////////////////////////

        //
        /*
        */

    addWhale: function() { 
        var whale = this.add.sprite(this.CANVAS_WIDTH+150, this.height-120, 'whale');
        whale.animations.add('swim');
        whale.animations.play('swim', 12, true);
        whale.scale.setTo(1.5, 1.5);
        whale.anchor.setTo(.5,.5);
        whale.angle += 5;
        whale.name = "whaleswim";
        this.gobothways(whale);
    },


    addCrab: function() { 
        var redcrab = this.add.sprite(225, this.height-65, 'redcrab');
        redcrab.animations.add('swim');
        redcrab.animations.play('swim', 15, true);
        redcrab.scale.setTo(-0.2, 0.2);


        //
        var greencrab = this.add.sprite(90, this.height-55, 'greencrab');
        greencrab.animations.add('swim');
        greencrab.animations.play('swim', 15, true);
        greencrab.scale.setTo(0.2, 0.2);
    },
    

    addKiteFish: function() { 
        var kitefish = this.add.sprite(this.CANVAS_WIDTH-120, this.height-85, 'kitefish');
        kitefish.animations.add('swim');
        kitefish.animations.play('swim', 15, true);
        kitefish.scale.setTo(0.5, 0.5);
    },



        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);

    addAngryFish: function() { 
        this.angryfish = this.add.sprite(-100, this.height-250, 'angryfish');
        this.angryfish.anchor.setTo(2.2,-0.1);
        this.angryfish.animations.add('swim');
        this.angryfish.animations.play('swim',20, true);
        this.angryfish.scale.setTo(0.25, 0.25);
        this.angryfish.name = "angryfishswim";
        this.gobothways(this.angryfish);
    },

    addAnchovies: function() { 
        //
        this.blueanchovy = this.add.sprite(-100, this.height-250, 'blueanchovy');
        this.blueanchovy.anchor.setTo(.9,.9);
        this.blueanchovy.animations.add('swim');
        this.blueanchovy.animations.play('swim',4, true);
        this.blueanchovy.scale.setTo(0.1, 0.1);
        this.blueanchovy.name = "blueanchovyswim";
        this.gobothways(this.blueanchovy);

        this.greenanchovy = this.add.sprite(-100, this.height-235, 'greenanchovy');
        this.greenanchovy.anchor.setTo(.5,.5);
        this.greenanchovy.animations.add('swim');
        this.greenanchovy.animations.play('swim',8, true);
        this.greenanchovy.scale.setTo(0.1, 0.1);
        this.greenanchovy.name = "greenanchovyswim";
        this.gobothways(this.greenanchovy);

        this.pinkanchovy = this.add.sprite(-100, this.height-270, 'pinkanchovy');
        this.pinkanchovy.anchor.setTo(.2,.2);
        this.pinkanchovy.animations.add('swim');
        this.pinkanchovy.animations.play('swim',2, true);
        this.pinkanchovy.scale.setTo(0.12, 0.12);
        this.pinkanchovy.name = "pinkanchovyswim";
        this.gobothways(this.pinkanchovy);
    },
    

    addCoral: function() { 
        //
        var coral = this.add.image(0, this.height-60, 'coral');
        coral.scale.setTo(0.5, 0.5);
        
    },  

    showunlockables: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata');
        console.log("Came here treasure");
        //this.game.destroy();
        this.ionic_scope.$emit('show:red',this.ionic_scope);

        var cache = [];
            JSON.stringify(this.ionic_scope, function(key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
            console.log(cache);
            cache = null; 

        //this.ionic_scope.reoutetored(this.ionic_scope);

    },

    gobothways: function(b){

        //console.log('start again ' + b.name);
        var change_amount = Math.floor(this.rnd.realInRange(0, 50));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        var pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.height) || (pos_y < 70)){
            pos_y = b.y + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }



        //if()
        if(b.x > this.CANVAS_WIDTH){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            //t= this.add.tween(b).to({ x: -200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t= this.add.tween(b).to({ x: -100+Math.floor(this.rnd.realInRange(0, 50)), y: pos_y }, 7500 + Math.floor(this.rnd.realInRange(0000, 4000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            //t = this.add.tween(b).to({ x: window.innerWidth + 200 }, 10500, Phaser.Easing.Quadratic.InOut, true, 0);
            t = this.add.tween(b).to({ x: this.CANVAS_WIDTH + 100 - Math.floor(this.rnd.realInRange(0, 50)), y: pos_y }, 7500 + Math.floor(this.rnd.realInRange(0000, 4000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }

        /*
        if(b.x > window.innerWidth){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            t= this.add.tween(b).to({ x: -100 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            t = this.add.tween(b).to({ x: window.innerWidth + 100 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        */
    },      
    
    buildFish: function() {
        
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

    },
    
    assignFishMovement: function(b) {
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
    },
    
    stopFish: function(b) {
        //this.assignFishMovement(b);
        this.gobothways(b);
    },
    
    addTally: function() {
        this.totalClicks = this.totalClicks + 1;
        this.countdown.setText('Fishes Fed: ' + this.totalClicks);
    },

    updatescore: function (added_points) {
        console.log("Update score called inside game, " + this.ionic_scope.total_points);
        this.totalPoints = this.ionic_scope.total_points;
        this.addAFish(added_points);
        this.countdown.setText('Points: ' + this.totalPoints);
    }
};