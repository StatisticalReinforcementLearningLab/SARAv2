FishGame.Game = function(game) {
    this.totalClicks;
    this.totalPoints;
    this.fishGroup;
    this.gameover;
    this.overmessage;
    this.greenfish;
    this.game = game;
    //this.music;


    this.isPrawnAdded;
    this.prawn;

    this.isClownFishAdded;
    this.clownFish;


    this.ionic_scope;
    this.height;

    this.active_task_connected;
    this.progress_sprite;
    this.prgress_bar_width;

    this.badgecount;

    this.CANVAS_WIDTH;
};

FishGame.Game.prototype = {
    
    create: function() {
        this.gameover = false;
        this.totalClicks = 0;
        this.totalPoints = this.ionic_scope.total_points;
        this.isPrawnAdded = false;
        this.isClownFishAdded = false;
        
        //this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);

        this.CANVAS_WIDTH = 382.0;
        //if((window.innerWidth > 382.0) &&  (window.innerHeight > 642.0)){
        //    this.CANVAS_WIDTH = window.innerWidth;
        //}
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        
        this.buildWorld();
        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

    },

    assignscope: function(scope) {
        this.ionic_scope = scope;
    },

    
    buildWorld: function() {
        //this.height = window.innerHeight-44;
        this.height = this.game.height;
        var titlescreen = this.add.image(0, this.height-160, 'titlescreen');
        titlescreen.scale.setTo(0.85, 0.85);

        //
        this.add.sprite(5, 40, 'timer', 1);

        //
        var fish_progress = this.add.image(175,50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);


        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);


        this.buildFish();
        this.addFishes();

        //
        var journal = this.add.image(this.CANVAS_WIDTH - 70, 10, 'journal');
        journal.scale.setTo(0.4, 0.4);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);

        //
        /*
        var trivia = this.add.image(window.innerWidth - 60, 95, 'trivia');
        trivia.scale.setTo(0.22, 0.22);
        trivia.inputEnabled = true;
        //trivia.events.onInputDown.add(this.logdata, this);
        */

        //
        /*
        var meme = this.add.image(window.innerWidth - 140, 1, 'meme');
        meme.scale.setTo(0.3, 0.3);
        meme.inputEnabled = true;
        meme.events.onInputDown.add(this.showBubbles, this);
        */

        //
        this.active_task_connected = this.add.image(10, 40, 'disconnected');
        this.active_task_connected.set
        this.active_task_connected.scale.setTo(0.15, 0.15);
        this.active_task_connected.inputEnabled = true;
        this.active_task_connected.events.onInputDown.add(this.logdata, this);
        this.active_task_connected.visible = false;
        

        var treasure = this.add.image(90, this.height-70, 'treasure');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);

        //
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);



        //this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

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

    //show the reward
    checkReinforcement: function(){
        this.ionic_scope.$emit('show:checkReinforcement',this.ionic_scope);
    },

    showBubbles2: function(){
        //add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(-100, 303, 'fatdiver');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 7, true);
        blackdiver.scale.setTo(1, 1);
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
        var pirate = this.add.image(this.game.width-145, 100, 'fatdiver2');
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
        //the divers
        var purplediver = this.add.sprite(-10, 183, 'purplediver');
        purplediver.anchor.setTo(.5,.5);
        purplediver.animations.add('swim');
        purplediver.animations.play('swim', 30, true);
        purplediver.scale.setTo(0.8, 0.8);
        this.add.tween(purplediver).to({ x: this.world.centerX-20 }, 800 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);

        var blackdiver = this.add.sprite(this.CANVAS_WIDTH+100, 303, 'blackdiver');
        blackdiver.anchor.setTo(.5,.5);
        blackdiver.animations.add('swim');
        blackdiver.animations.play('swim', 30, true);
        blackdiver.scale.setTo(-0.8, 0.8);
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

        //you earned a reward
        var pirate = this.add.image(this.game.width-145, 90, 'diver');
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
    },

    //show the reward
    showReward: function(){
        this.ionic_scope.$emit('show:reinforcement',this.ionic_scope);
    },

    //update the connected and disconnected things
    updateconnectivity: function(state) {
        //console.log("Is connected: " +  state);
        this.active_task_connected.visible = state;
    },


    logdata: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        this.ionic_scope.$emit('survey:logdata', this.ionic_scope);
        //console.log("Came here");
    },


    showunlockables: function() {
        //this.totalClicks = this.totalClicks + 1;
        //this.countdown.setText('Fishes Fed: ' + this.totalClicks);
        //this.ionic_scope.$emit('survey:logdata');
        console.log("Came here treasure");
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

    addFishes: function(){

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
                if(data[i].name.valueOf() === "Nemo-the clown fish")
                    this.animateClownFish();


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

                if(data[i].name.valueOf() === "The crab")
                    this.animateCrab();

                if(data[i].name.valueOf() === "Green fish")
                    this.animateGreenFish();

                if(data[i].name.valueOf() === "Electric fish")
                    this.animatePurpleFish();

                if(data[i].name.valueOf() === "Discus fish")
                    this.animateDiscusFish();

                if(data[i].name.valueOf() === "Betta fish")
                    this.animateBettaFish();

                if(data[i].name.valueOf() === "Sea horse")
                    this.animateSeaHorse();

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

    animateButterflyFish: function(){
        //angel
        var butterflyFish = this.add.sprite(-100, this.height-300, 'butterfly');
        butterflyFish.animations.add('swim');
        butterflyFish.animations.play('swim', 10, true);
        butterflyFish.scale.setTo(0.5, 0.5);
        this.gobothways(butterflyFish);    
    },

    animateTigerbarb: function(){    
        //
        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        var tigerbarbfish = this.add.sprite(-100, this.height-120, 'tigerbarb');
        tigerbarbfish.animations.add('swim');
        tigerbarbfish.animations.play('swim', 10, true);
        tigerbarbfish.scale.setTo(0.6, 0.6);
        this.gobothways(tigerbarbfish); 
    },

    animatePufferFish: function(){    
        //
        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        var pufferfish = this.add.sprite(-100, 60, 'puffer');
        pufferfish.animations.add('swim');
        pufferfish.animations.play('swim', 10, true);
        pufferfish.scale.setTo(0.5, 0.5);
        this.gobothways(pufferfish); 
    },

    animateSquid: function(){
        //squid
        var squid = this.add.sprite(- 120, this.height-190, 'squid');
        squid.animations.add('swim');
        squid.animations.play('swim', 5, true);
        squid.scale.setTo(0.19, 0.19);
        this.gobothways(squid);

    },


    animateAngelFish: function(){

        //angel
        var angelfish = this.add.sprite(-100, this.height-260, 'angelfish');
        angelfish.animations.add('swim');
        angelfish.animations.play('swim', 10, true);
        angelfish.scale.setTo(0.4, 0.4);
        this.gobothways(angelfish);

    },


    animateDiscusFish: function(){

        //
        var discusfish = this.add.sprite(-100, this.height-150, 'discusfish');
        discusfish.animations.add('swim');
        discusfish.animations.play('swim', 15, true);
        discusfish.scale.setTo(0.4, 0.4);
        this.gobothways(discusfish);

    },


    animateBettaFish: function(){

        //
        var bettafish = this.add.sprite(this.CANVAS_WIDTH-150, this.height-130, 'bettafish');
        bettafish.animations.add('swim');
        bettafish.animations.play('swim', 5, true);
        bettafish.scale.setTo(0.25, 0.25);


    },


    animateClownFish: function(){
        //
        this.clownFish = this.add.sprite(-100, 253, 'clownfish');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 30, true);
        this.clownFish.scale.setTo(0.35, 0.35);
        this.clownFish.name = "clownFish";
        this.gobothways(this.clownFish);

    },


    animateGoldFish: function(){
        //goldfish
        var goldfish = this.add.sprite(this.CANVAS_WIDTH+100, 193, 'goldfish');
        goldfish.animations.add('swim');
        goldfish.animations.play('swim', 10, true);
        goldfish.scale.setTo(0.27, 0.27);
        this.gobothways(goldfish);

    },


    animateGreenFish: function(){

        var greenFish = this.add.sprite(this.CANVAS_WIDTH + 100, 153, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.2, 0.2);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);


    },


    animateSeaHorse: function(){

        var seahorse = this.add.sprite(this.CANVAS_WIDTH-60, 150, 'seahorseyellow');
        seahorse.animations.add('swim');
        seahorse.animations.play('swim', 10, true);
        //seahorse.anchor.setTo(0.5, 0.5);
        seahorse.scale.setTo(0.08, 0.08);


    },


    animateOctpus: function(){
        var octopus = this.add.sprite(40, 200, 'octopus');
        octopus.animations.add('swim');
        octopus.animations.play('swim', 30, true);
        octopus.scale.setTo(0.2, 0.2);
        this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

    },


    animatePurpleFish: function(){

        var purpleFish = this.add.sprite(-100, 103, 'seacreatures');
        purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
        purpleFish.animations.play('swim');
        purpleFish.anchor.setTo(.5,.5);
        purpleFish.scale.setTo(0.5, 0.5);
        purpleFish.name = "purplefish";
        //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
        this.gobothways(purpleFish);


    },


    animateCrab: function(){
        var crab = this.add.sprite(190, this.height-50, 'seacreatures');
        crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
        crab.animations.play('swim');
        crab.scale.setTo(0.52, 0.52);

    },




    animateStarFishes: function(){
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

        //Discus
        /*
        var discusfish = this.add.sprite(20, 300, 'discusfish');
        discusfish.animations.add('swim');
        discusfish.animations.play('swim', 15, true);
        discusfish.scale.setTo(0.6, 0.6);
        

        //betta fish
        var bettafish = this.add.sprite(window.innerWidth - 200, 250, 'bettafish');
        bettafish.animations.add('swim');
        bettafish.animations.play('swim', 5, true);
        bettafish.scale.setTo(0.3, 0.3);

        var seahorse = this.add.sprite(window.innerWidth-80, 150, 'seahorseyellow');
            seahorse.animations.add('swim');
            seahorse.animations.play('swim', 10, true);
            //seahorse.anchor.setTo(0.5, 0.5);
            seahorse.scale.setTo(0.1, 0.1);
        
        var purpleFish = this.add.sprite(-100, 53, 'seacreatures');
            purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
            purpleFish.animations.play('swim');
            purpleFish.anchor.setTo(.5,.5);
            purpleFish.scale.setTo(0.6, 0.6);
            purpleFish.name = "purplefish";
            //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
            this.gobothways(purpleFish);


        */

        //if(this.totalPoints >= 0 && this.totalPoints < 25)
        {



            //this.isPrawnAdded = true;
            //this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
            //this.prawn.scale.setTo(0.5, 0.5);
        }


        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        /*
        {
            var starfish = this.add.sprite(150, this.height-30, 'seacreatures', 'starfish0000');
            starfish.scale.setTo(0.7, 0.7);
            var starfish2 = this.add.sprite(180, this.height-40, 'seacreatures', 'starfish0000');
            starfish2.scale.setTo(0.4, 0.4);
        }
        */



        //if(this.totalPoints >= 100 && this.totalPoints < 125)
        {
            
        }


        //if(this.totalPoints >= 150 && this.totalPoints < 175)
        {
            
        }


        //if(this.totalPoints >= 200 && this.totalPoints < 225)
        {
            
        }

        //if(this.totalPoints >= 250 && this.totalPoints < 275)
        {

        }

        //if(this.totalPoints >= 300 && this.totalPoints < 325)
        {
            
        }



        /*
        var octopus = this.add.sprite(40, 200, 'octopus');
        octopus.animations.add('swim');
        octopus.animations.play('swim', 30, true);
        octopus.scale.setTo(0.3, 0.3);
        this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


        //crab
        var crab = this.add.sprite(230, 440, 'seacreatures');
        crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
        crab.animations.play('swim');
        crab.scale.setTo(0.7, 0.7);

        //
        var purpleFish = this.add.sprite(-100, 53, 'seacreatures');
        purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
        purpleFish.animations.play('swim');
        purpleFish.anchor.setTo(.5,.5);
        purpleFish.scale.setTo(0.6, 0.6);
        purpleFish.name = "purplefish";
        //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
        this.gobothways(purpleFish);

        //
        var squid = this.add.sprite(90, 440, 'seacreatures', 'squid0000');
        squid.scale.setTo(0.4, 0.4);


        //
        //var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
        //prawn.scale.setTo(0.5, 0.5);

        if(this.isPrawnAdded == true){
            var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
            prawn.scale.setTo(0.5, 0.5);
        }

        if(this.isClownFishAdded == true){
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.8, 0.8);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }

        //
        var starfish = this.add.sprite(150, 470, 'seacreatures', 'starfish0000');
        starfish.scale.setTo(0.7, 0.7);
        var starfish2 = this.add.sprite(180, 460, 'seacreatures', 'starfish0000');
        starfish2.scale.setTo(0.4, 0.4);


        //
        var greenFish = this.add.sprite(window.innerWidth + 100, 153, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.4, 0.4);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);
        */

    },

    gobothways: function(b){
        //console.log('start again ' + b.name);

        //if()
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
            //
            t= this.add.tween(b).to({ x: -50 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            t = this.add.tween(b).to({ x: window.innerWidth + 50 }, 7500 + Math.floor(this.rnd.realInRange(0, 2000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        */
    },
    
    buildFish: function() {
          //assign number of fish
            numfish = 0;
            //assign type and age of fish
            var fishType = ["green1", "horse1", "purple1", "pink1", "magenta1"]
            this.fishGroup = this.add.group();
            this.fishGroup.enableBody = true;
            for(i = 0; i < numfish; i++){
                var b = this.fishGroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.integerInRange(this.world.height-300, this.world.height-200), fishType[i]);
                b.anchor.setTo(0.5, 0.5);
                b.body.moves = false;
                b.inputEnabled = true; //true;
                b.events.onInputDown.add(this.addTally, this);
                this.assignFishMovement(b);
            }
    },
    
    assignFishMovement: function(b) {
        xposition = Math.floor(this.rnd.realInRange(-100, this.world.width+100));
        yposition = Math.floor(this.rnd.realInRange(50, this.world.height-150));
        bdelay = 0; //this.rnd.integerInRange(2000, 6000);
        if(xposition < b.x){
            b.scale.x = -1;
        }else{
            b.scale.x = 1;
        }
        b.animations.add('swim');
        b.animations.play('swim', 30, true);
        t = this.add.tween(b).to({x:xposition, y:yposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        t.onComplete.add(this.stopFish, this);
    },
    
    stopFish: function(b) {
        //this.assignFishMovement(b);
        //console.log('stopped');
        this.gobothways(b);
    },
    
    addTally: function() {
        this.totalClicks = this.totalClicks + 1;
        this.countdown.setText('Fishes Fed: ' + this.totalClicks);
    },


    updatescore: function (added_points) {
        console.log("Update score called inside game, " + this.ionic_scope.total_points + ", added: " + added_points);
        this.totalPoints = this.ionic_scope.total_points;
        this.addAFish(added_points);
        this.countdown.setText('Points: ' + this.totalPoints);
    },

    test: function () {


        //
        this.totalPoints = this.totalPoints + 25;
        this.countdown.setText('Points: ' + this.totalPoints);


        if(this.totalPoints >= 0 && this.totalPoints < 25){
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.5, 0.5);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);


            this.isPrawnAdded = true;
            this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
            this.prawn.scale.setTo(0.5, 0.5);
        }


        if(this.totalPoints >= 50 && this.totalPoints < 75){
            var starfish = this.add.sprite(150, this.height-30, 'seacreatures', 'starfish0000');
            starfish.scale.setTo(0.7, 0.7);
            var starfish2 = this.add.sprite(180, this.height-40, 'seacreatures', 'starfish0000');
            starfish2.scale.setTo(0.4, 0.4);
        }



        if(this.totalPoints >= 100 && this.totalPoints < 125){
            var octopus = this.add.sprite(40, 200, 'octopus');
            octopus.animations.add('swim');
            octopus.animations.play('swim', 30, true);
            octopus.scale.setTo(0.3, 0.3);
            this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        }


        if(this.totalPoints >= 150 && this.totalPoints < 175){
            var greenFish = this.add.sprite(window.innerWidth + 100, 153, 'greenfish');
            greenFish.anchor.setTo(.5,.5);
            greenFish.animations.add('swim');
            greenFish.animations.play('swim', 30, true);
            greenFish.scale.setTo(0.3, 0.3);
            greenFish.name = "greenfish";
            this.gobothways(greenFish);
        }


        if(this.totalPoints >= 200 && this.totalPoints < 225){
            var crab = this.add.sprite(230, this.height-60, 'seacreatures');
            crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
            crab.animations.play('swim');
            crab.scale.setTo(0.7, 0.7);
        }

        if(this.totalPoints >= 250 && this.totalPoints < 275){
            var purpleFish = this.add.sprite(-100, 53, 'seacreatures');
            purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
            purpleFish.animations.play('swim');
            purpleFish.anchor.setTo(.5,.5);
            purpleFish.scale.setTo(0.6, 0.6);
            purpleFish.name = "purplefish";
            //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
            this.gobothways(purpleFish);
        }

        if(this.totalPoints >= 300 && this.totalPoints < 325){
            var seahorse = this.add.sprite(window.innerWidth-80, 150, 'seahorseyellow');
            seahorse.animations.add('swim');
            seahorse.animations.play('swim', 10, true);
            //seahorse.anchor.setTo(0.5, 0.5);
            seahorse.scale.setTo(0.1, 0.1);
        }

        /*
        var octopus = this.add.sprite(40, 200, 'octopus');
        octopus.animations.add('swim');
        octopus.animations.play('swim', 30, true);
        octopus.scale.setTo(0.3, 0.3);
        this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


        //crab
        var crab = this.add.sprite(230, 440, 'seacreatures');
        crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
        crab.animations.play('swim');
        crab.scale.setTo(0.7, 0.7);

        //
        var purpleFish = this.add.sprite(-100, 53, 'seacreatures');
        purpleFish.animations.add('swim', Phaser.Animation.generateFrameNames('purpleFish', 0, 20, '', 4), 30, true);
        purpleFish.animations.play('swim');
        purpleFish.anchor.setTo(.5,.5);
        purpleFish.scale.setTo(0.6, 0.6);
        purpleFish.name = "purplefish";
        //this.add.tween(purpleFish).to({ x:  -100 }, 3500, Phaser.Easing.Quadratic.InOut, true, 0, 1000, false);
        this.gobothways(purpleFish);

        //
        var squid = this.add.sprite(90, 440, 'seacreatures', 'squid0000');
        squid.scale.setTo(0.4, 0.4);


        //
        //var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
        //prawn.scale.setTo(0.5, 0.5);

        if(this.isPrawnAdded == true){
            var prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
            prawn.scale.setTo(0.5, 0.5);
        }

        if(this.isClownFishAdded == true){
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.8, 0.8);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }

        //
        var starfish = this.add.sprite(150, 470, 'seacreatures', 'starfish0000');
        starfish.scale.setTo(0.7, 0.7);
        var starfish2 = this.add.sprite(180, 460, 'seacreatures', 'starfish0000');
        starfish2.scale.setTo(0.4, 0.4);


        //
        var greenFish = this.add.sprite(window.innerWidth + 100, 153, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.4, 0.4);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);
        */


        /*
        var cache = [];
            JSON.stringify(this, function(key, value) {
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
        */    

        //console.log('Test function ' + this.isPrawnAdded);

        /*
        if(this.isPrawnAdded == false){
            this.isPrawnAdded = true;
            this.prawn = this.add.sprite(10, 450, 'seacreatures', 'prawn0000');
            this.prawn.scale.setTo(0.5, 0.5);
        }else{
            this.isPrawnAdded = false;
            this.prawn.destroy();
            //prawn.scale.setTo(0.5, 0.5);
        }

        if(this.isClownFishAdded == false){
            this.isClownFishAdded = true;
            this.clownFish = this.add.sprite(-100, 253, 'clownfish');
            this.clownFish.anchor.setTo(.5,.5);
            this.clownFish.animations.add('swim');
            this.clownFish.animations.play('swim', 30, true);
            this.clownFish.scale.setTo(0.5, 0.5);
            this.clownFish.name = "clownFish";
            this.gobothways(this.clownFish);
        }else{
            this.isClownFishAdded = false;
            this.clownFish.destroy();
            //prawn.scale.setTo(0.5, 0.5);
        }*/



    },

    update: function(){
        //console.log("Update: isPrawnAdded, " + this.isPrawnAdded);
    }
};