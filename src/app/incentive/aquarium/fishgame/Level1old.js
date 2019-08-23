FishGame.Level1 = function(game) {
    this.totalClicks;
    this.fishGroup;
    this.gameover;
    this.overmessage;
    this.music;
    this.game = game;
};

FishGame.Level1.prototype = {
    
    create: function() {
        this.gameover = false;
        this.totalClicks = 0;
        
        this.music = this.add.audio('game_audio');
        //this.music.play('', 0, 1.0, true);
        
        this.buildWorld();


        this.inputEnabled = false;

        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;
    },
    
    buildWorld: function() {
        this.height = window.innerHeight-44;
        var undersea = this.add.image(0, 0, 'undersea');
        undersea.scale.setTo(0.8, 0.8);

        //coral
        

        //undersea.x = -200;
        //undersea.y = 0;
        //undersea.height = this.game.height;
        //undersea.width = this.game.width*5;

        

        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Fishes Fed: ' + this.totalClicks, 20);

        //this.buildFish();
        this.buildAquarium();
    },

    buildAquarium: function() {

        ////////////////////////////////////////////////////////////
        //upper aquarium
        ////////////////////////////////////////////////////////////
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




        
        ////////////////////////////////////////////////////////////
        // mid aquarium
        ////////////////////////////////////////////////////////////
        var dori = this.add.sprite(160, 260, 'dori');
        dori.animations.add('swim');
        dori.animations.play('swim', 15, true);
        dori.scale.setTo(-0.15, 0.15);

        var nemo = this.add.sprite(-15, 270, 'nemo');
        nemo.animations.add('swim');
        nemo.animations.play('swim', 15, true);
        nemo.scale.setTo(0.30, 0.30);

        var yellowtang = this.add.sprite(60, 330, 'yellowtang');
        yellowtang.animations.add('swim');
        yellowtang.animations.play('swim', 5, true);
        yellowtang.scale.setTo(0.3, 0.3);
        yellowtang.anchor.setTo(.5,.5);


        //
        var jellyfish = this.add.sprite(window.innerWidth - 80, 240, 'jellyfish');
        jellyfish.animations.add('swim');
        jellyfish.animations.play('swim', 15, true);
        jellyfish.scale.setTo(0.15, 0.15);


        var salmon = this.add.sprite(window.innerWidth - 80, 340, 'salmon');
        salmon.animations.add('swim');
        salmon.animations.play('swim', 10, true);
        salmon.scale.setTo(0.25, 0.25);
        salmon.anchor.setTo(.5,.5);



        ////////////////////////////////////////////////////////////
        // bottom aquarium
        ////////////////////////////////////////////////////////////

        //
        var whale = this.add.sprite(window.innerWidth+150, this.height-100, 'whale');
        whale.animations.add('swim');
        whale.animations.play('swim', 12, true);
        whale.scale.setTo(1.8, 1.8);
        whale.anchor.setTo(.5,.5);
        whale.angle += 5;
        whale.name = "whaleswim";
        this.gobothways(whale);


        var redcrab = this.add.sprite(window.innerWidth, this.height-100, 'redcrab');
        redcrab.animations.add('swim');
        redcrab.animations.play('swim', 15, true);
        redcrab.scale.setTo(-0.3, 0.3);






        //
        var coral = this.add.image(0, this.height-60, 'coral');
        coral.scale.setTo(0.5, 0.5);


        //
        var greencrab = this.add.sprite(window.innerWidth-200, this.height-70, 'greencrab');
        greencrab.animations.add('swim');
        greencrab.animations.play('swim', 15, true);
        greencrab.scale.setTo(0.3, 0.3);

        //angryfish
        //var angryfish = this.add.sprite(220, this.height-205, 'angryfish');
        //angryfish.animations.add('swim');
        //angryfish.animations.play('swim', 15, true);
        //angryfish.scale.setTo(0.35, 0.35);

        this.angryfish = this.add.sprite(-100, this.height-150, 'angryfish');
        this.angryfish.anchor.setTo(.5,.5);
        this.angryfish.animations.add('swim');
        this.angryfish.animations.play('swim',20, true);
        this.angryfish.scale.setTo(0.3, 0.3);
        this.angryfish.name = "angryfishswim";
        this.gobothways(this.angryfish);


        


        

        //
        this.blueanchovy = this.add.sprite(-100, this.height-230, 'blueanchovy');
        this.blueanchovy.anchor.setTo(.9,.9);
        this.blueanchovy.animations.add('swim');
        this.blueanchovy.animations.play('swim',4, true);
        this.blueanchovy.scale.setTo(0.12, 0.12);
        this.blueanchovy.name = "blueanchovyswim";
        this.gobothways(this.blueanchovy);

        this.greenanchovy = this.add.sprite(-100, this.height-215, 'greenanchovy');
        this.greenanchovy.anchor.setTo(.5,.5);
        this.greenanchovy.animations.add('swim');
        this.greenanchovy.animations.play('swim',8, true);
        this.greenanchovy.scale.setTo(0.1, 0.1);
        this.greenanchovy.name = "greenanchovyswim";
        this.gobothways(this.greenanchovy);

        this.pinkanchovy = this.add.sprite(-100, this.height-250, 'pinkanchovy');
        this.pinkanchovy.anchor.setTo(.2,.2);
        this.pinkanchovy.animations.add('swim');
        this.pinkanchovy.animations.play('swim',2, true);
        this.pinkanchovy.scale.setTo(0.13, 0.13);
        this.pinkanchovy.name = "pinkanchovyswim";
        this.gobothways(this.pinkanchovy);




        
    },  

    gobothways: function(b){
        //console.log('start again ' + b.name);

        //if()
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
    }
};