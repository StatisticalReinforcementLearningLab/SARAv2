export class GameTundraL5 extends Phaser.State {

    //componentObject;
    constructor(){
        super();
        this.componentObject;
        this.snowgswitch;
        this.back_emitter;
        this.mid_emitter;
        this.yeti;
    }

    //
    create() {

        console.log("create called");
        var s = this.game.add.sprite(0,0,'tundra1');
        s.rotation = 0.0;
        s.width = this.game.width;
        s.height = this.game.height;

        //
        this.height = this.game.height;

        //---
        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        //---
        var timer = this.add.sprite(5, 40, 'timer', 1);

        //--- 
        var fish_progress = this.add.image(175, 50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
 
        //--- 
        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);
 

        //
        this.snowgswitch = this.add.image(5, 100, 'snowgswitch');
        this.snowgswitch.scale.setTo(0.15, 0.15);
        this.snowgswitch.inputEnabled = true;
        this.snowgswitch.events.onInputDown.addOnce(this.startsnowing, this);

        

        //
        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;


        //
        var treasure = this.add.image(this.game.width-150, this.height-180, 'treasure_tundra');
        treasure.scale.setTo(-0.16, 0.15);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);


        //
        this.addAnimals();

        //
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);

    }

    startsnowing(){
        console.log("start snowing");

        //var mid_emitter;
        //var back_emitter;
        
        this.back_emitter = this.game.add.emitter(this.game.world.centerX, -32, 600);
        this.back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        this.back_emitter.maxParticleScale = 0.6;
        this.back_emitter.minParticleScale = 0.2;
        this.back_emitter.setYSpeed(20, 100);
        this.back_emitter.gravity = 0;
        this.back_emitter.width = this.game.world.width * 1.5;
        this.back_emitter.minRotation = 0;
        this.back_emitter.maxRotation = 40;

        this.mid_emitter = this.game.add.emitter(this.game.world.centerX, -32, 250);
        this.mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        this.mid_emitter.maxParticleScale = 1.2;
        this.mid_emitter.minParticleScale = 0.8;
        this.mid_emitter.setYSpeed(50, 150);
        this.mid_emitter.gravity = 0;
        this.mid_emitter.width = this.game.world.width * 1.5;
        this.mid_emitter.minRotation = 0;
        this.mid_emitter.maxRotation = 40;

        this.back_emitter.start(false, 14000, 20);
        this.mid_emitter.start(false, 12000, 40);

        this.snowgswitch.events.onInputDown.addOnce(this.stopsnowing, this);
    }

    stopsnowing(){
        this.back_emitter.destroy();
        this.mid_emitter.destroy();
        this.snowgswitch.events.onInputDown.addOnce(this.startsnowing, this);
    }




    addAnimals(){

        var phaserJSON = this.game.cache.getJSON('fishpoints');


        var data = phaserJSON;
        var survey_string = "";
        var current_points = this.totalPoints;
        for(var i = 0; i < data.length; i++) {
            if(current_points >= data[i].points){


                //nemo
                if(data[i].name.valueOf() === "Penguin")
                    this.animatePenguin();

                if(data[i].name.valueOf() === "Sealion")
                    this.animateSealion();
                
                

                if(data[i].name.valueOf() === "Wolf")
                    this.animateWolf();

                if(data[i].name.valueOf() === "Bird")
                    this.animateBirds();

                if(data[i].name.valueOf() === "Hare")
                    this.animateHare();

                if(data[i].name.valueOf() === "Pingu")
                    this.animatePingu();    

                if(data[i].name.valueOf() === "Coyote")
                    this.animateCoyote();                

                if(data[i].name.valueOf() === "White Husky")
                    this.animateWhiteHusky();  

                if(data[i].name.valueOf() === "Grey Husky")
                    this.animateBrwonHusky();  

                if(data[i].name.valueOf() === "Yeti")
                    this.animateYeti();  

                if(data[i].name.valueOf() === "Bear")
                    this.animateBear();  

                if(data[i].name.valueOf() === "Raindeer")
                    this.animateReindeer();
                

               /* 
               if(data[i].name.valueOf() === "Rabbit")
               this.animateRabbit();  
               */

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

        this.progress_sprite = this.game.add.sprite(5, 40, 'timer', 0);
        var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);
        var percent = (current_points-previoous_fish_point)/(next_fish_point-previoous_fish_point);
        console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * this.progress_sprite.width);

        console.log("Width, " + rect.width  + "," + this.progress_sprite.width);
        this.progress_sprite.crop(rect);
    }

    //
    animateWhiteHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 235, 'white_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "white_husky";
    }

    //
    animateBrwonHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 205, 'grey_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "grey_husky";
    }

    //
    animatePingu(){
        this.pingu = this.add.sprite(105, this.game.height - 135, 'pingu');
        this.pingu.anchor.setTo(.5,.5);
        this.pingu.animations.add('swim2');
        this.pingu.animations.play('swim2',4, true);
        this.pingu.scale.setTo(0.35, 0.35);
        this.pingu.name = "pingu";
    }

    animateWolf(){
        this.wolf = this.add.sprite(this.game.width+100, this.game.height-295, 'wolf_walk');
        this.wolf.anchor.setTo(.5,.5);
        this.wolf.animations.add('swim');
        this.wolf.animations.play('swim', 3, true);
        this.wolf.scale.setTo(.8, .8);
        this.wolf.name = "wolf";
        this.gobothways(this.wolf);
    }

    animateBear(){
        this.brown_bear = this.add.sprite(-200, this.game.height-275, 'brown_bear');
        this.brown_bear.anchor.setTo(.5,.5);
        this.brown_bear.animations.add('swim');
        this.brown_bear.animations.play('swim', 6, true);
        this.brown_bear.scale.setTo(-.15, .15);
        this.brown_bear.name = "brown_bear";
        this.gobothways(this.brown_bear);
    }

    animateRabbit(){
        this.rabbit = this.add.sprite(this.game.width+215, this.game.height-125, 'rabbit');
        this.rabbit.anchor.setTo(.5,.5);
        this.rabbit.animations.add('swim2');
        this.rabbit.animations.play('swim2', 20, true);
        this.rabbit.scale.setTo(-0.4, 0.4);
        this.rabbit.name = "rabbit";
        this.gobothways(this.rabbit);
    }

    //
    animateHare(){
        this.hare = this.add.sprite(this.game.width+115, this.game.height - 245, 'hare');
        this.hare.anchor.setTo(.5,.5);
        this.hare.animations.add('swim2');
        this.hare.animations.play('swim2', 5, true);
        this.hare.scale.setTo(0.4, 0.4);
        this.hare.name = "hare";
        this.gobothways(this.hare);
    }


    //
    animateReindeer(){
        this.reindeer = this.add.sprite(-115, this.game.height - 145, 'reindeer');
        this.reindeer.anchor.setTo(.5,.5);
        this.reindeer.animations.add('swim2');
        this.reindeer.animations.play('swim2', 5, true);
        this.reindeer.scale.setTo(-0.15, 0.15);
        this.reindeer.name = "reindeer";
        this.gobothways(this.reindeer);
    }


    //
    animateCoyote(){
        this.coyote = this.add.sprite(-115, this.game.height - 225, 'coyote');
        this.coyote.anchor.setTo(.5,.5);
        this.coyote.animations.add('swim2');
        this.coyote.animations.play('swim2', 5, true);
        this.coyote.scale.setTo(-1, 1);
        this.coyote.name = "coyote";
        this.gobothways(this.coyote);
    }


    //
    animateBirds(){
        this.birds = this.add.sprite(-50, 95, 'bird_fly');
        this.birds.anchor.setTo(.5,.5);
        this.birds.animations.add('swim2');
        this.birds.animations.play('swim2', 5, true);
        this.birds.scale.setTo(-0.3, 0.3);
        this.birds.name = "birds";
        //this.pegions.body.velocity.x = -20;
        this.gobothways(this.birds);
    }

    //
    animatePenguin(){
        this.penguins = this.add.sprite(-15, this.game.height - 145, 'penguin');
        this.penguins.anchor.setTo(.5,.5);
        this.penguins.animations.add('swim2');
        this.penguins.animations.play('swim2', 5, true);
        this.penguins.scale.setTo(0.3, 0.3);
        this.penguins.name = "pegions";
        //this.pegions.body.velocity.x = -20;
        var t = this.add.tween(this.penguins).to({ x: 45, y: this.game.height - 145}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        //this.gobothways(this.penguins);
        t.onComplete.add(function(){this.penguins.animations.stop(null, true);}, this);
    }

    //
    animateYeti(){
        this.yeti = this.add.sprite(this.game.width-15, this.game.height - 225, 'yeti_walk');
        this.yeti.anchor.setTo(.5,.5);
        this.yeti.animations.add('swim2');
        this.yeti.animations.play('swim2', 5, true);
        this.yeti.scale.setTo(-0.5, 0.5);
        this.yeti.name = "yeti";
        var t = this.add.tween(this.yeti).to({ x: this.game.width-45, y: this.game.height - 225}, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){
            this.yeti.animations.stop(null, true);
            this.yeti.loadTexture('yeti_standing', 0);
            this.yeti.inputEnabled = true;
            this.yeti.events.onInputDown.addOnce(this.changeYetiLaugh, this);
        }, this);
    }

    changeYetiLaugh(){
        console.log("changed to laugh");
        this.yeti.loadTexture('yeti_laugh', 0);
        this.yeti.animations.add('swim');
        this.yeti.animations.play('swim', 5, true);
        this.yeti.events.onInputDown.addOnce(this.changeToStanding, this);
    }

    changeToStanding(){
        console.log("changed to standing");
        this.yeti.loadTexture('yeti_standing', 0);
        this.yeti.events.onInputDown.addOnce(this.changeYetiLaugh, this);
    }

   

    animateSealion(){
        this.sealion = this.add.sprite(this.game.width+15, this.game.height - 145, 'sea_lion_silver');
        this.sealion.anchor.setTo(.5,.5);
        this.sealion.animations.add('swim2');
        this.sealion.animations.play('swim2', 5, true);
        this.sealion.scale.setTo(1.3, 1.3);
        this.sealion.name = "sea_lion_silver";
        var t = this.add.tween(this.sealion).to({ x: this.game.width-75, y: this.game.height - 145}, 3000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.sealion.animations.stop(null, true);}, this);

        this.sealion_brown = this.add.sprite(this.game.width+25, this.game.height - 145, 'sea_lion_brown');
        this.sealion_brown.anchor.setTo(.5,.5);
        this.sealion_brown.animations.add('swim2');
        this.sealion_brown.animations.play('swim2', 5, true);
        this.sealion_brown.scale.setTo(1.3, 1.3);
        this.sealion_brown.name = "sea_lion_brown";
        var t = this.add.tween(this.sealion_brown).to({ x: this.game.width-45, y: this.game.height - 175}, 5000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.sealion_brown.animations.stop(null, true);}, this);
    }


    gobothways(b){

        var change_amount = Math.floor(this.rnd.realInRange(0, 150));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        var pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.height) || (pos_y < 70)){
            pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }

        var t, X, Y;
        if(b.x > this.CANVAS_WIDTH){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            X = -100+Math.floor(this.rnd.realInRange(0, 50));//+Math.floor(this.rnd.realInRange(0, 50)); + Math.floor(this.rnd.realInRange(0, 2000))
            t= this.add.tween(b).to({ x: X, y: pos_y}, 17500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            X = this.CANVAS_WIDTH + 100 - Math.floor(this.rnd.realInRange(0, 50)); //+ Math.floor(this.rnd.realInRange(0, 2000))
            t = this.add.tween(b).to({ x: X, y: pos_y }, 17500+ Math.floor(this.rnd.realInRange(0, 5000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        //*/

       
    }

    gobothways2(b,duration){

        var change_amount = Math.floor(this.rnd.realInRange(0, 150));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        var pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.height) || (pos_y < 70)){
            pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }

        var t, X, Y;
        if(b.x > this.CANVAS_WIDTH){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            X = -100+Math.floor(this.rnd.realInRange(0, 50));//+Math.floor(this.rnd.realInRange(0, 50)); + Math.floor(this.rnd.realInRange(0, 2000))
            t= this.add.tween(b).to({ x: X, y: pos_y}, duration, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            X = this.CANVAS_WIDTH + 100 - Math.floor(this.rnd.realInRange(0, 50)); //+ Math.floor(this.rnd.realInRange(0, 2000))
            t = this.add.tween(b).to({ x: X, y: pos_y }, duration, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        //*/

       
    }

    stopFish(b) {
        //this.assignFishMovement(b);
        //console.log('stopped');
        this.gobothways(b);
    }

    setTotalPoints(totalPoints){
		this.totalPoints = totalPoints;
    }  
    
    assignscope(componentObject){
        this.componentObject = componentObject;
    }

    showunlockables(){
        console.log('treasure box clicked');
        this.componentObject.goToRewardsPage();
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
}
