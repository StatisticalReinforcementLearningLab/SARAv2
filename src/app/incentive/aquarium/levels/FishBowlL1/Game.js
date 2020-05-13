export class FishBowlL1 extends Phaser.State {

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

        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;
        
        //
        this.buildWorld();
        this.game.inputEnabled = false;

        //
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

    }

    buildWorld() {

        //
        this.height = this.game.height;
        this.add.image(0, this.height-210, 'titlescreen');

        //
        var timer = this.add.sprite(5, 40, 'timer', 1);

        /*
        var fish_progress = this.add.image(175,50, 'clownfish_grey');
        fish_progress.scale.setTo(-0.3, 0.3);
        fish_progress.anchor.setTo(.5,.5);
        */

        /*
        var pouch = this.add.image(15,80, 'diamond');
        pouch.scale.setTo(0.4, 0.4);
        pouch.anchor.setTo(.5,.5);
        this.badgecount = this.add.bitmapText(30, 73, 'eightbitwonder', "" + 2, 12);
        */

        //
        var treasure = this.add.image(90, this.height-80, 'treasure');
        treasure.scale.setTo(0.3, 0.3);
        treasure.inputEnabled = true;
        treasure.events.onInputDown.add(this.showunlockables, this);

        
        //
        this.buildFish();
        this.addFishes();

        //
        /*
        var journal = this.add.image(this.CANVAS_WIDTH - 70, 10, 'journal');
        journal.scale.setTo(0.4, 0.4);
        journal.inputEnabled = true;
        journal.events.onInputDown.add(this.logdata, this);
        */

        

        //
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Points: ' + this.totalPoints, 20);

        //
        this.game.onPause.add(this.yourGamePausedFunc, this);
        this.game.onResume.add(this.yourGameResumedFunc, this);

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

              if(data[i].name.valueOf() === "Butterfly fish")
                  this.animateButterflyFish();

              if(data[i].name.valueOf() === "Puffer fish")
                  this.animatePufferFish();

              if(data[i].name.valueOf() === "Tiger barb")
                  this.animateTigerbarb();
              

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
        butterflyFish.scale.setTo(0.7, 0.7);
        this.gobothways(butterflyFish);    
    }

    animateTigerbarb(){    
        //
        //if(this.totalPoints >= 50 && this.totalPoints < 75)
        var tigerbarbfish = this.add.sprite(-100, this.height-120, 'tigerbarb');
        tigerbarbfish.animations.add('swim');
        tigerbarbfish.animations.play('swim', 10, true);
        tigerbarbfish.scale.setTo(0.8, 0.8);
        this.gobothways(tigerbarbfish); 
    }

    animatePufferFish(){    
        
        var pufferfish = this.add.sprite(-100, 50, 'puffer');
        pufferfish.animations.add('swim');
        pufferfish.animations.play('swim', 5, true);
        pufferfish.scale.setTo(0.7, 0.7);
        this.gobothways(pufferfish);
        
    }
    
    animateAngelFish(){
        //angel
        var angelfish = this.add.sprite(-100, this.height-250, 'angelfish');
        angelfish.animations.add('swim');
        angelfish.animations.play('swim', 10, true);
        angelfish.scale.setTo(0.6, 0.6);
        this.gobothways(angelfish);    
    }
    
    animateGreenFish(){    
        //
        var greenFish = this.add.sprite(this.CANVAS_WIDTH + 100, 103, 'greenfish');
        greenFish.anchor.setTo(.5,.5);
        greenFish.animations.add('swim');
        greenFish.animations.play('swim', 30, true);
        greenFish.scale.setTo(0.3, 0.3);
        greenFish.name = "greenfish";
        this.gobothways(greenFish);
    }

    animateStarFishes(){
        var redstarfish = this.add.sprite(30, this.height-28, 'redstarfish');
        redstarfish.animations.add('swim');
        redstarfish.animations.play('swim', 2, true);
        redstarfish.anchor.setTo(0.5,0.5);
        redstarfish.angle -= 20;
        redstarfish.scale.setTo(0.10, 0.10);

        var bluestarfish = this.add.sprite(70, this.height-22, 'bluestarfish');
        bluestarfish.animations.add('swim');
        bluestarfish.animations.play('swim', 1, true);
        bluestarfish.anchor.setTo(0.5,0.5);
        bluestarfish.angle -= 0;
        bluestarfish.scale.setTo(0.06, 0.06);

        var greenstarfish = this.add.sprite(190, this.height-22, 'greenstarfish');
        greenstarfish.animations.add('swim');
        greenstarfish.animations.play('swim', 5, true);
        greenstarfish.anchor.setTo(0.5,0.5);
        greenstarfish.angle +=10;
        greenstarfish.scale.setTo(0.08, 0.08);
    }

    animateGoldFish(){
        var goldfish = this.add.sprite(this.CANVAS_WIDTH+100, 153, 'goldfish');
        goldfish.animations.add('swim');
        goldfish.animations.play('swim', 10, true);
        goldfish.scale.setTo(0.4, 0.4);
        this.gobothways(goldfish);
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

    animateOctpus(){
            var octopus = this.add.sprite(40, 200, 'octopus');
            octopus.animations.add('swim');
            octopus.animations.play('swim', 30, true);
            octopus.scale.setTo(0.3, 0.3);
            this.add.tween(octopus).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
    }


    animateCrab(){
            var crab = this.add.sprite(230, this.height-60, 'seacreatures');
            crab.animations.add('swim', Phaser.Animation.generateFrameNames('crab1', 0, 25, '', 4), 30, true);
            crab.animations.play('swim');
            crab.scale.setTo(0.7, 0.7);
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