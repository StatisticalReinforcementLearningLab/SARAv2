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
        var aspect_ratio = s.width/s.height;
        s.height = this.game.height - 310;
        s.width = s.height*aspect_ratio;

        //--- this is the bottom screen, blue water thing.
        var titlescreen = this.add.image(0, this.game.height-60, 'titlescreen');
        titlescreen.scale.setTo(0.6, 0.6);


        //
        this.height = this.game.height;

        //---
        //this.CANVAS_WIDTH = 382.0;
        //if(window.innerWidth > this.CANVAS_WIDTH)
        //    this.CANVAS_WIDTH = window.innerWidth;

        //---
        var timer = this.add.sprite(5, 40, 'timer', 1);

        //--- 
        var fish_progress = this.add.image(175, 50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
 
        //--- 
        /*
        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);
        */

        //
        this.snowgswitch = this.add.image(5, 70, 'snowgswitch');
        this.snowgswitch.scale.setTo(0.15, 0.15);
        this.snowgswitch.inputEnabled = true;
        this.snowgswitch.events.onInputDown.addOnce(this.startsnowing, this);

        

        //
        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;




        //
        this.addAnimals();

        //
        var treasure = this.add.image(this.game.width-150, this.height-125, 'treasure_tundra');
        treasure.scale.setTo(-0.16, 0.15);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);

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

                if(data[i].name.valueOf() === "Seal")
                    this.animateSealion();

                if(data[i].name.valueOf() === "Grey Wolf")
                    this.animateWolf();

                if(data[i].name.valueOf() === "Brown Bear")
                    this.animateBear(); 

                if(data[i].name.valueOf() === "Snow Bunting")
                    this.animateBirds();

                if(data[i].name.valueOf() === "Hare")
                    this.animateHare();

                if(data[i].name.valueOf() === "Pingu, the Penguin")
                    this.animatePingu();    

                //if(data[i].name.valueOf() === "Coyote")
                //    this.animateCoyote();                

                if(data[i].name.valueOf() === "White Husky")
                    this.animateWhiteHusky();  

                if(data[i].name.valueOf() === "Grey Husky")
                    this.animateBrwonHusky();  

                if(data[i].name.valueOf() === "Yeti")
                    this.animateYeti();  

                 

                if(data[i].name.valueOf() === "Reindeer")
                    this.animateReindeer();
                
                if(data[i].name.valueOf() === "Blue Jay")
                    this.animateBlueJay()

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

    //-- Add Penguin
    animatePenguin(){

        console.log("Device pixel ratio is: " + window.devicePixelRatio)

        var starting_pos_x, starting_pos_y, ending_pos_x, ending_pos_y, scale_x, scale_y;
        starting_pos_x = -15;
        starting_pos_y = this.game.height - 145;
        ending_pos_x = 45;
        ending_pos_y = this.game.height - 105;
        scale_x = 0.3;
        scale_y = 0.3;

        this.penguins = this.add.sprite(starting_pos_x, starting_pos_y, 'penguin');
        this.penguins.anchor.setTo(.5,.5);
        this.penguins.animations.add('swim2');
        this.penguins.animations.play('swim2', 5, true);
        this.penguins.scale.setTo(scale_x, scale_y);
        this.penguins.name = "pegions";
        var t = this.add.tween(this.penguins).to({ x: ending_pos_x, y: ending_pos_y}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.penguins.animations.stop(null, true);}, this);
    }
    
    //-- Add sea lion
    animateSealion(){

        var starting_pos_x, starting_pos_y, ending_pos_x, ending_pos_y, scale_x, scale_y;
        
        
        //---- sea lion silver
        starting_pos_x = this.game.width+15;
        starting_pos_y = this.game.height - 105;
        ending_pos_x = this.game.width-75;
        ending_pos_y = this.game.height - 105;
        scale_x = 1.3;
        scale_y = 1.3;

        this.sealion = this.add.sprite(starting_pos_x, starting_pos_y, 'sea_lion_silver');
        this.sealion.anchor.setTo(.5,.5);
        this.sealion.animations.add('swim2');
        this.sealion.animations.play('swim2', 5, true);
        this.sealion.scale.setTo(scale_x, scale_y);
        this.sealion.name = "sea_lion_silver";
        var t = this.add.tween(this.sealion).to({ x: ending_pos_x, y: ending_pos_y}, 3000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.sealion.animations.stop(null, true);}, this);


        //---- sea lion brown
        starting_pos_x = this.game.width+25;
        starting_pos_y = this.game.height - 135;
        ending_pos_x = this.game.width-45;
        ending_pos_y = this.game.height - 135;
        scale_x = 1.3;
        scale_y = 1.3;

        this.sealion_brown = this.add.sprite(starting_pos_x, starting_pos_y, 'sea_lion_brown');
        this.sealion_brown.anchor.setTo(.5,.5);
        this.sealion_brown.animations.add('swim2');
        this.sealion_brown.animations.play('swim2', 5, true);
        this.sealion_brown.scale.setTo(scale_x, scale_y);
        this.sealion_brown.name = "sea_lion_brown";
        var t = this.add.tween(this.sealion_brown).to({x: ending_pos_x, y: ending_pos_y}, 5000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.sealion_brown.animations.stop(null, true);}, this);

        //---- sea lion pink
        starting_pos_x = this.game.width+125;
        starting_pos_y = this.game.height - 85;
        ending_pos_x = this.game.width-25;
        ending_pos_y = this.game.height - 85;
        scale_x = 0.8;
        scale_y = 0.8;

        this.sealion_pink = this.add.sprite(starting_pos_x, starting_pos_y, 'sea_lion_pink');
        this.sealion_pink.anchor.setTo(.5,.5);
        this.sealion_pink.animations.add('swim2');
        this.sealion_pink.animations.play('swim2', 5, true);
        this.sealion_pink.scale.setTo(scale_x, scale_y);
        this.sealion_pink.name = "sea_lion_pink";
        var t = this.add.tween(this.sealion_pink).to({x: ending_pos_x, y: ending_pos_y}, 5000, Phaser.Easing.Quadratic.InOut, true, 0);
        t.onComplete.add(function(){this.sealion_pink.animations.stop(null, true);}, this);

    }

    //--- add wolf animation.
    animateWolf(){

        var starting_pos_x, starting_pos_y, scale_x, scale_y;

        //---- wolf walk
        starting_pos_x = this.game.width-100;
        starting_pos_y = this.game.height-285;
        scale_x = 0.8;
        scale_y = 0.8;

        this.wolf = this.add.sprite(starting_pos_x, starting_pos_y, 'wolf_walk');
        //this.wolf = this.add.sprite(this.game.width+100, this.game.height-295, 'wolf_walk');
        this.wolf.anchor.setTo(.5,.5);
        this.wolf.animations.add('swim');
        this.wolf.animations.play('swim', 3, true);
        this.wolf.scale.setTo(scale_x, scale_y);
        this.wolf.name = "wolf";
        this.wolf.startingDirection = "leftToRight";
        this.wolf.spriteFacesDirection = "right";
        this.gobothways(this.wolf);
    }

    animateBear(){
        this.brown_bear = this.add.sprite(-200, this.game.height-325, 'brown_bear');
        this.brown_bear.anchor.setTo(.5,.5);
        this.brown_bear.animations.add('swim');
        this.brown_bear.animations.play('swim', 6, true);
        this.brown_bear.scale.setTo(-.15, .15);
        this.brown_bear.name = "brown_bear";
        this.gobothways(this.brown_bear);
    }

    //
    animateWhiteHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 215, 'white_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "white_husky";
    }

    //
    animateBrwonHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 185, 'grey_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "grey_husky";
    }

    //
    animatePingu(){
        this.pingu = this.add.sprite(105, this.game.height - 105, 'pingu');
        this.pingu.anchor.setTo(.5,.5);
        this.pingu.animations.add('swim2');
        this.pingu.animations.play('swim2',4, true);
        this.pingu.scale.setTo(0.35, 0.35);
        this.pingu.name = "pingu";
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
        this.hare = this.add.sprite(this.game.width-115, this.game.height - 245, 'hare');
        this.hare.anchor.setTo(.5,.5);
        this.hare.animations.add('swim2');
        this.hare.animations.play('swim2', 5, true);
        this.hare.scale.setTo(0.4, 0.4);
        this.hare.name = "hare";
        this.hare.startingDirection = "rightToLeft";
        this.hare.spriteFacesDirection = "right";
        this.gobothways(this.hare);
    }


    //
    animateReindeer(){
        //this.reindeer = this.add.sprite(-115, this.game.height - 145, 'reindeer');
        this.reindeer = this.add.sprite(-75, this.game.height - 225, 'reindeer');
        this.reindeer.anchor.setTo(.5,.5);
        this.reindeer.animations.add('swim2');
        this.reindeer.animations.play('swim2', 5, true);
        this.reindeer.scale.setTo(-0.12, 0.12);
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
    animateBlueJay(){
        this.blue_jay = this.add.sprite(this.game.width-50, 145, 'blue_jay');
        this.blue_jay.anchor.setTo(.5,.5);
        this.blue_jay.animations.add('swim2');
        this.blue_jay.animations.play('swim2', 5, true);
        this.blue_jay.scale.setTo(0.6, 0.6);
        this.blue_jay.name = "blue_jay";
        //this.pegions.body.velocity.x = -20;
        this.gobothways(this.blue_jay);
    }   

    //
    animateYeti(){
        this.yeti = this.add.sprite(this.game.width-15, this.game.height - 205, 'yeti_walk');
        this.yeti.anchor.setTo(.5,.5);
        this.yeti.animations.add('swim2');
        this.yeti.animations.play('swim2', 5, true);
        this.yeti.scale.setTo(-0.5, 0.5);
        this.yeti.name = "yeti";
        var t = this.add.tween(this.yeti).to({ x: this.game.width-45, y: this.game.height - 205}, 2000, Phaser.Easing.Quadratic.InOut, true, 0);
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


    gobothways(b){

        //console.log('reached: ' + "gobothways" + " " + b.name);

        var change_amount = Math.floor(this.rnd.realInRange(0, 150));
        if(Math.floor(this.rnd.realInRange(0, 10))==2)
            change_amount = 3*change_amount;
        
        var pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        while((pos_y > this.game.height) || (pos_y < 70)){
            pos_y = b.y;// + Math.floor(this.rnd.realInRange(-1*change_amount, change_amount));
        }

        var t, X, Y;
        if(b.x > this.game.width){ 
            //console.log('right to left, ' + b.x);
            //b.scale.setTo(-0.4, 0.4);//b.scale.x * (-1);
            b.scale.x = -1*b.scale.x;
            X = -100+Math.floor(this.rnd.realInRange(0, 50));//+Math.floor(this.rnd.realInRange(0, 50)); + Math.floor(this.rnd.realInRange(0, 2000))
            t= this.add.tween(b).to({ x: X, y: pos_y}, 17500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            b.scale.x = -1*b.scale.x;
            X = this.game.width + 100 - Math.floor(this.rnd.realInRange(0, 50)); //+ Math.floor(this.rnd.realInRange(0, 2000))
            t = this.add.tween(b).to({ x: X, y: pos_y }, 17500+Math.floor(this.rnd.realInRange(0, 5000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        //*/ 


        if((b.x >= 0) && (b.x <= this.game.width)){   
            if(b.startingDirection == "leftToRight"){
                if(b.spriteFacesDirection == "left"){
                    //going "leftToRight", animalSprite is "right facing"
                    b.scale.x = -1*b.scale.x;
                }

                var speedMultiplier = (this.game.width + 100 - b.x)/(this.game.width + 100 + 100);
                X = this.game.width + 100 - Math.floor(this.rnd.realInRange(0, 50)); //+ Math.floor(this.rnd.realInRange(0, 2000))
                t = this.add.tween(b).to({ x: X, y: pos_y }, speedMultiplier*(17500+Math.floor(this.rnd.realInRange(0, 5000))), Phaser.Easing.Quadratic.InOut, true, 0);
                t.onComplete.add(this.stopFish, this);
            }else{
                //going rightToLeft
                if(b.spriteFacesDirection == "right"){ 
                    b.scale.x = -1*b.scale.x;
                }
                var speedMultiplier = (b.x + 100)/(this.game.width + 100 + 100);
                X = -100+Math.floor(this.rnd.realInRange(0, 50));//+Math.floor(this.rnd.realInRange(0, 50)); + Math.floor(this.rnd.realInRange(0, 2000))
                t= this.add.tween(b).to({ x: X, y: pos_y}, speedMultiplier*17500, Phaser.Easing.Quadratic.InOut, true, 0);
                t.onComplete.add(this.stopFish, this); 
            }
        }
        

    }

    stopFish(b) {
        this.gobothways(b);
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
