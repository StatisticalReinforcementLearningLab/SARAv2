
export class TundraLevel1 extends Phaser.State {
    //componentObject;
    constructor(){
        super();
        this.componentObject;
        //this.thirstyplant;
    }

    //preload the images
    preload(){
        console.log("Preload called");
        this.input.addPointer();
        this.game.load.image('tundra1','assets/pics/bg-tundra.png');
        
        this.game.load.atlasJSONArray('penguin', 'assets/game/sprite/penguin_sprite.png', 'assets/game/sprite/penguin_sprite.json');
        this.game.load.atlasJSONArray('pingu', 'assets/game/sprite/pingu_tundra_sprite.png', 'assets/game/sprite/pingu_tundra_sprite.json');
        this.game.load.atlasJSONArray('sea_lion_silver', 'assets/game/sprite/sea_lion_silver_sprite.png', 'assets/game/sprite/sea_lion_silver_sprite.json');
        this.game.load.atlasJSONArray('sea_lion_brown', 'assets/game/sprite/sea_lion_brown_sprite.png', 'assets/game/sprite/sea_lion_brown_sprite.json');
        this.game.load.atlasJSONArray('wolf_walk', 'assets/game/sprite/wolf_walk_sprite.png', 'assets/game/sprite/wolf_walk_sprite.json');
        this.game.load.atlasJSONArray('bird_fly', 'assets/game/sprite/bird_tundra_sprite.png', 'assets/game/sprite/bird_tundra_sprite.json');
        this.game.load.atlasJSONArray('hare', 'assets/game/sprite/hare_tundra_sprite.png', 'assets/game/sprite/hare_tundra_sprite.json');
    
        //
        this.game.load.atlasJSONArray('coyote', 'assets/game/sprite/coyote_tundra_sprite.png', 'assets/game/sprite/coyote_tundra_sprite.json');
    
        //
        this.game.load.atlasJSONArray('grey_husky', 'assets/game/sprite/husky_grey_tundra_sprite.png', 'assets/game/sprite/husky_grey_tundra_sprite.json');
        this.game.load.atlasJSONArray('white_husky', 'assets/game/sprite/husky_white_tundra_sprite.png', 'assets/game/sprite/husky_white_tundra_sprite.json');

    }

    //gets executed after preload
    create(){
        console.log("create called");
        var s = this.game.add.sprite(0,0,'tundra1');
        s.rotation = 0.0;
        s.width = this.game.width;
        s.height = this.game.height;
        //s.inputEnabled = true;
        //s.events.onInputDown.add(this.changeToAttack, this);

        //
        //var attackplant = this.game.add.sprite(-10, this.game.height-230, 'attackplant');
        //attackplant.animations.add('swim');
        //attackplant.animations.play('swim', 15, true);
        //attackplant.scale.setTo(1, 1);
        //this.game.inputEnabled = false;
        //

        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        //
        this.animatePenguin();
        this.animateSealion();
        this.animateWolf();

        //
        this.animateBirds();
        this.animateHare();
        this.animateCoyote();

        //
        this.animatePingu();
        this.animateWhiteHusky();
        this.animateBrwonHusky();

        //
        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

    }

    //
    animateWhiteHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 235, 'white_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "white_husky";
        //this.pegions.body.velocity.x = -20;
        //var t = this.add.tween(this.pingu).to({ x: 45, y: this.game.height - 145}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        //this.gobothways(this.penguins);
        //t.onComplete.add(function(){this.pingu.animations.stop(null, true);}, this);
    }

    //
    animateBrwonHusky(){
        this.white_husky = this.add.sprite(65, this.game.height - 205, 'grey_husky');
        this.white_husky.anchor.setTo(.5,.5);
        this.white_husky.animations.add('swim2');
        this.white_husky.animations.play('swim2',15, true);
        this.white_husky.scale.setTo(0.35, 0.35);
        this.white_husky.name = "grey_husky";
        //this.pegions.body.velocity.x = -20;
        //var t = this.add.tween(this.pingu).to({ x: 45, y: this.game.height - 145}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        //this.gobothways(this.penguins);
        //t.onComplete.add(function(){this.pingu.animations.stop(null, true);}, this);
    }

    //
    animatePingu(){
        this.pingu = this.add.sprite(105, this.game.height - 135, 'pingu');
        this.pingu.anchor.setTo(.5,.5);
        this.pingu.animations.add('swim2');
        this.pingu.animations.play('swim2',4, true);
        this.pingu.scale.setTo(0.35, 0.35);
        this.pingu.name = "pingu";
        //this.pegions.body.velocity.x = -20;
        //var t = this.add.tween(this.pingu).to({ x: 45, y: this.game.height - 145}, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        //this.gobothways(this.penguins);
        //t.onComplete.add(function(){this.pingu.animations.stop(null, true);}, this);
    }

    //if(this.totalPoints >= 0 && this.totalPoints < 25)
    animateWolf(){
        this.wolf = this.add.sprite(this.game.width+100, this.game.height-295, 'wolf_walk');
        this.wolf.anchor.setTo(.5,.5);
        this.wolf.animations.add('swim');
        this.wolf.animations.play('swim', 3, true);
        this.wolf.scale.setTo(.8, .8);
        this.wolf.name = "wolf";
        this.gobothways(this.wolf);


        //this.isPrawnAdded = true;
        //this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
        //this.prawn.scale.setTo(0.5, 0.5);
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
   
    

}