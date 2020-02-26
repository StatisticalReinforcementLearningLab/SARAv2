export class GameRainforestL6 extends Phaser.State {
    //componentObject;
    constructor(){
        super();
        this.componentObject;
        this.thirstyplant;
        this.triceratops;
        this.lion;
        this.pegions;
        this.vulture;
        this.sparrow;
        this.duck1;
        this.duck2;
        this.chicken;
        this.owl;
        this.koala;
        this.corn;
    }

    //gets executed after preload
    create(){
        console.log("create called");

        //reinforestBackgroundBottom1
        var reinforestBackgroundBottom1 = this.add.image(0, this.game.height-320, 'reinforestBackgroundBottom1');
        //reinforestBackgroundBottom1.scale.setTo(0.6, 0.6);
        var aspect_ratio = reinforestBackgroundBottom1.width/reinforestBackgroundBottom1.height;
        reinforestBackgroundBottom1.height = 250;
        reinforestBackgroundBottom1.width = reinforestBackgroundBottom1.height*aspect_ratio;


        //reinforestBackgroundBottom2
        var reinforestBackgroundBottom2 = this.add.image(0, this.game.height-120, 'reinforestBackgroundBottom2');
        //reinforestBackgroundBottom1.scale.setTo(0.6, 0.6);
        aspect_ratio = reinforestBackgroundBottom2.width/reinforestBackgroundBottom2.height;
        reinforestBackgroundBottom2.height = 120;
        reinforestBackgroundBottom2.width = reinforestBackgroundBottom2.height*aspect_ratio;


        var s = this.game.add.sprite(0,0,'reinforest1');
        //s.rotation = 0.0;
        //s.width = this.game.width;
        //s.height = this.game.height;
        //var s = this.game.add.sprite(0,0,'tundra1');
        s.rotation = 0.0;
        aspect_ratio = s.width/s.height;
        s.height = this.game.height - 310;
        s.width = s.height*aspect_ratio;

        

        //
        this.height = this.game.height;

        //---
        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        this.animatePegions();
        this.addAnimals();

        

        //--- 
        var fish_progress = this.add.image(175, 50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);


        //add the rock to cover the carnivorous plant
        var journal = this.add.image(-5, this.game.height - 195, 'rock2');
        journal.scale.setTo(.3*0.8,.18*0.8);
        

        //
        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;


        //
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //
        var treasure = this.add.image(10, this.game.height - 135, 'treasure');
        treasure.scale.setTo(0.07, 0.07);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);
        

        //
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);

    }

    addAnimals(){

        var phaserJSON = this.game.cache.getJSON('fishpoints');


        var data = phaserJSON;
        var survey_string = "";
        var current_points = this.totalPoints;
        for(var i = 0; i < data.length; i++) {
            if(current_points >= data[i].points){

                //nemo
                if(data[i].name.valueOf() === "Squirrel")
                    this.animateSquirrel();

                if(data[i].name.valueOf() === "Carnivore")
                    this.animateCarnivorePlant();
                
                if(data[i].name.valueOf() === "Lion")
                    this.animateLionMain();

                if(data[i].name.valueOf() === "Ostrich")
                    this.animateOstrich();

                if(data[i].name.valueOf() === "Triceratops")
                    this.animateTriceratopsMain();

                if(data[i].name.valueOf() === "Corn")
                    this.animateCornMain();    

                if(data[i].name.valueOf() === "Chicken")
                    this.animateChicken();               

                if(data[i].name.valueOf() === "Duck")
                    this.animateGooseDuck(); 

                if(data[i].name.valueOf() === "Owl")
                    this.animateOwl();

                if(data[i].name.valueOf() === "Sparrow")
                    this.animateSparrow();

                if(data[i].name.valueOf() === "Vulture")
                    this.animateVulture();

                if(data[i].name.valueOf() === "Koala")
                    this.animateKoalaMain();
              

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
        //---
        var timer = this.add.sprite(5, 40, 'timer', 1);

        this.progress_sprite = this.game.add.sprite(5, 40, 'timer', 0);
        var rect = new Phaser.Rectangle(0, 0, 0, this.progress_sprite.height);
        var percent = (current_points-previoous_fish_point)/(next_fish_point-previoous_fish_point);
        console.log("" + current_points + "," + previoous_fish_point + "," + next_fish_point + "," + percent);
        rect.width = Math.max(0, percent * this.progress_sprite.width);

        console.log("Width, " + rect.width  + "," + this.progress_sprite.width);
        this.progress_sprite.crop(rect);
    }

    animateCarnivorePlant(){
        //
        console.log("adding thristy plant");
        var thirstyplant = this.game.add.sprite(-30, this.game.height-310, 'thirstyplant');
        thirstyplant.animations.add('swim');
        thirstyplant.animations.play('swim', 15, true);
        thirstyplant.scale.setTo(.72, .72);
        thirstyplant.inputEnabled = true;
        this.thirstyplant = thirstyplant;
        thirstyplant.events.onInputDown.addOnce(this.changeToAttack, this);
    }

    
    animateCornMain(){
        console.log("adding corn");
        var corn = this.game.add.sprite(120, this.game.height-230, 'corn_stand');
        corn.animations.add('swim');
        corn.animations.play('swim', 5, true);
        corn.scale.setTo(.64, .64);
        corn.inputEnabled = true;
        this.corn = corn;
        corn.events.onInputDown.addOnce(this.changeToAttackCorn, this);
    }


    animateKoalaMain(){
        //
        this.koala = this.add.sprite(this.game.width+30, this.game.height-270, 'koala');
        this.animateKoala();
    }
    //
    animateKoala(){
        console.log("Idle koala");
        this.koala.loadTexture('koala', 0);
        this.koala.animations.add('swim');
        this.koala.animations.play('swim', 2, true);
        this.koala.scale.setTo(-.24, .24);
        //this.triceratops.inputEnabled = true;
        //this.triceratops.events.onInputDown.addOnce(this.animateLionJump, this);
        this.koala.name = "koala";
    }

    //
    animateTriceratopsMain(){
        this.triceratops = this.add.sprite(this.game.width+20, this.game.height-240, 'triceratops');
        this.animateTriceratops();
    }

    //
    animateTriceratops(){
        console.log("Idle triceratops");
        this.triceratops.loadTexture('triceratops', 0);
        this.triceratops.animations.add('swim');
        this.triceratops.animations.play('swim', 2, true);
        this.triceratops.scale.setTo(-.32, .32);
        this.triceratops.name = "triceratops";
    }

    animateLionMain(){//
        //
        this.lion = this.add.sprite(this.game.width-60, this.game.height-240, 'lion');
        this.animateLion();
    }

    //
    animateLion(){
        console.log("Idle lion");
        this.lion.loadTexture('lion', 0);
        this.lion.animations.add('swim');
        this.lion.animations.play('swim', 3, true);
        this.lion.scale.setTo(-0.8, 0.8);
        this.lion.inputEnabled = true;
        this.lion.events.onInputDown.addOnce(this.animateLionJump, this);
        this.lion.name = "lion";
        //this.pegions.body.velocity.x = -20;
        //this.gobothways(this.lion);
    }

    //
    animateLionJump(){
        
        console.log("Jump lion jump");

        //this.thirstyplant.loadTexture('attackplant', 0);

        //this.lion = this.add.sprite(this.game.width-30, this.game.height-250, 'lionjump');
        this.lion.loadTexture('lionjump', 0);
        this.lion.animations.add('swim');
        this.lion.animations.play('swim', 5, true);
        this.lion.scale.setTo(-0.8, 0.8);
        //this.lion.inputEnabled = true;
        //thirstyplant.events.onInputDown.add(this.changeToAttack, this);
        this.lion.name = "lion";
        //this.pegions.body.velocity.x = -20;
        //this.gobothways(this.lion);

        //
        //this.lion.animations.currentAnim.onComplete.add(this.animateLion, this);
        this.lion.events.onInputDown.addOnce(this.animateLion, this);
    }

    //
    animatePegions(){
        this.pegions = this.add.sprite(-500, 95, 'pegions');
        this.pegions.anchor.setTo(.5,.5);
        this.pegions.animations.add('swim2');
        this.pegions.animations.play('swim2', 5, true);
        this.pegions.scale.setTo(-0.7, 0.7);
        this.pegions.name = "pegions";
        //this.pegions.body.velocity.x = -20;
        this.gobothways(this.pegions);
    }

    //
    animateVulture(){
        this.vulture = this.add.sprite(-40, 75, 'vulture_flying');
        this.vulture.anchor.setTo(.5,.5);
        this.vulture.animations.add('swim2');
        this.vulture.animations.play('swim2', 5, true);
        this.vulture.scale.setTo(0.15, 0.15);
        this.vulture.name = "vulture";
        this.gobothways(this.vulture);
    }

    //
    animateSparrow(){
        this.sparrow = this.add.sprite(this.game.width+750, 215, 'sparrow_flying');
        this.sparrow.anchor.setTo(.5,.5);
        this.sparrow.animations.add('swim2');
        this.sparrow.animations.play('swim2', 15, true);
        this.sparrow.scale.setTo(-0.15, 0.15);
        this.sparrow.name = "sparrow";
        this.gobothways(this.sparrow);
    }

    //
    animateGooseDuck(){
        this.duck1 = this.add.sprite(this.game.width+250, 135, 'goose_flying');
        this.duck1.anchor.setTo(.5,.5);
        this.duck1.animations.add('swim2');
        this.duck1.animations.play('swim2', 15, true);
        this.duck1.scale.setTo(-0.12, 0.12);
        this.duck1.name = "duck1";
        this.gobothways(this.duck1);

        this.duck2 = this.add.sprite(this.game.width+300, 145, 'duck_flying');
        this.duck2.anchor.setTo(.5,.5);
        this.duck2.animations.add('swim2');
        this.duck2.animations.play('swim2', 15, true);
        this.duck2.scale.setTo(-0.11, 0.11);
        this.duck2.name = "duck2";
        this.gobothways(this.duck2);
    }

    //
    animateChicken(){
        this.chicken = this.add.sprite(this.game.width+150, 235, 'chicken_flying');
        this.chicken.anchor.setTo(.5,.5);
        this.chicken.animations.add('swim2');
        this.chicken.animations.play('swim2', 15, true);
        this.chicken.scale.setTo(-0.1, 0.11);
        this.chicken.name = "chicken";
        this.gobothways(this.chicken);
    }

    //
    animateOwl(){
        this.owl = this.add.sprite(this.game.width+550, 255, 'owl_flying');
        this.owl.anchor.setTo(.5,.5);
        this.owl.animations.add('swim2');
        this.owl.animations.play('swim2', 15, true);
        this.owl.scale.setTo(-0.1, 0.1);
        this.owl.name = "owl";
        this.gobothways(this.owl);
    }


    //
    /*
    animateSparrow(){
        this.sparrow = this.add.sprite(this.game.width+250, 65, 'sparrow_flying');
        this.sparrow.anchor.setTo(.5,.5);
        this.sparrow.animations.add('swim');
        this.sparrow.animations.play('swim', 5, true);
        this.sparrow.scale.setTo(0.1, 0.);
        this.sparrow.name = "sparrow";
        this.gobothways(this.sparrow);
    }
    */


    //if(this.totalPoints >= 0 && this.totalPoints < 25)
    animateOstrich(){
        this.clownFish = this.add.sprite(this.game.width+250, this.game.height-225, 'ostrich');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 10, true);
        this.clownFish.scale.setTo(0.4, 0.4);
        this.clownFish.name = "squirrel";
        this.gobothways(this.clownFish);


        //this.isPrawnAdded = true;
        //this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
        //this.prawn.scale.setTo(0.5, 0.5);
    }

    //if(this.totalPoints >= 0 && this.totalPoints < 25)
    animateSquirrel(){
        this.ostrich = this.add.sprite(-50, this.game.height-200, 'squirrel');
        this.ostrich.anchor.setTo(.5,.5);
        this.ostrich.animations.add('swim2');
        this.ostrich.animations.play('swim2', 25, true);
        this.ostrich.scale.setTo(-0.56, 0.56);
        this.ostrich.name = "ostrich";
        this.gobothways(this.ostrich);


        //this.isPrawnAdded = true;
        //this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
        //this.prawn.scale.setTo(0.5, 0.5);
    }




    changeToAttack(){
        console.log("changed to attack");
        this.thirstyplant.loadTexture('attackplant', 0);
        this.thirstyplant.animations.add('swim');
        this.thirstyplant.animations.play('swim', 15, true);
        this.thirstyplant.events.onInputDown.addOnce(this.changeToThirsty, this);
    }

    changeToThirsty(){
        console.log("changed to thirsty");
        this.thirstyplant.loadTexture('thirstyplant', 0);
        this.thirstyplant.animations.add('swim');
        this.thirstyplant.animations.play('swim', 15, true);
        this.thirstyplant.events.onInputDown.addOnce(this.changeToAttack, this);
    }

    changeToAttackCorn(){
        console.log("changed to attack");
        this.corn.loadTexture('corn_attach', 0);
        this.corn.animations.add('swim');
        this.corn.animations.play('swim', 5, true);
        this.corn.events.onInputDown.addOnce(this.changeToAttackCornKiss, this);
    }


    changeToAttackCornKiss(){
        console.log("changed to thirsty");
        this.corn.loadTexture('corn_stand', 0);
        this.corn.animations.add('swim');
        this.corn.animations.play('swim', 5, true);
        this.corn.events.onInputDown.addOnce(this.changeToAttackCorn, this);
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
            X = -200+Math.floor(this.rnd.realInRange(0, 200));//+Math.floor(this.rnd.realInRange(0, 50)); + Math.floor(this.rnd.realInRange(0, 2000))
            t= this.add.tween(b).to({ x: X, y: pos_y}, 7500, Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this); 
        }

        if(b.x < 0){
            //console.log('left to right, ' + b.x);
            b.scale.x = -1*b.scale.x;
            X = this.CANVAS_WIDTH + 200 - Math.floor(this.rnd.realInRange(0, 200)); //+ Math.floor(this.rnd.realInRange(0, 2000))
            t = this.add.tween(b).to({ x: X, y: pos_y }, 9500+ Math.floor(this.rnd.realInRange(0, 5000)), Phaser.Easing.Quadratic.InOut, true, 0);
            t.onComplete.add(this.stopFish, this);
        }
        //*/
    }

    stopFish(b) {
        //this.assignFishMovement(b);
        //console.log('stopped');
        this.gobothways(b);
    }

    buildWorld() {

    }

    showunlockables(){
        console.log('treasure box clicked');
        this.componentObject.goToRewardsPage();
    }


    setTotalPoints(totalPoints){
		this.totalPoints = totalPoints;
    } 

    assignscope(componentObject){
        this.componentObject = componentObject;
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