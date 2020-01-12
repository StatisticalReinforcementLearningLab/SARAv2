export class ReinforestLevel1 extends Phaser.State {
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

    //preload the images
    preload(){
        console.log("Preload called");
        this.input.addPointer();
        this.game.load.image('rock2','assets/pics/rock2.png');
        this.game.load.image('reinforest1','assets/pics/bg-3.png');
        this.game.load.atlasJSONArray('attackplant', 'assets/game/sprite/attack_plant.png', 'assets/game/sprite/attack_plant.json');
        this.game.load.atlasJSONArray('thirstyplant', 'assets/game/sprite/thirsty_plant.png', 'assets/game/sprite/thirsty_plant.json');
        this.game.load.atlasJSONArray('squirrel', 'assets/game/sprite/squirrel_run-0.png', 'assets/game/sprite/squirrel_run.json');
        this.game.load.atlasJSONArray('ostrich', 'assets/game/sprite/ostrich_sprite.png', 'assets/game/sprite/ostrich_sprite.json');
        this.game.load.atlasJSONArray('pegions', 'assets/game/sprite/5-pegions.png', 'assets/game/sprite/5-pegions.json');
        this.game.load.atlasJSONArray('lion', 'assets/game/sprite/brave_lion_idle-0.png', 'assets/game/sprite/brave_lion_idle-0.json');
        this.game.load.atlasJSONArray('triceratops', 'assets/game/sprite/triceratops_idle_sprit.png', 'assets/game/sprite/triceratops_idle_sprit.json');
        this.game.load.atlasJSONArray('koala', 'assets/game/sprite/koala_sprite.png', 'assets/game/sprite/koala_sprite.json');
        this.game.load.atlasJSONArray('lionjump', 'assets/game/sprite/brave_lion_jump-0.png', 'assets/game/sprite/brave_lion_jump-0.json');

        //
        this.game.load.atlasJSONArray('corn_stand', 'assets/game/sprite/cron_stand_sprite.png', 'assets/game/sprite/cron_stand_sprite.json');
        this.game.load.atlasJSONArray('corn_attach', 'assets/game/sprite/cron_attack_sprite.png', 'assets/game/sprite/cron_attack_sprite.json');

        //
        this.game.load.atlasJSONArray('vulture_flying', 'assets/game/sprite/vulture_sprite.png', 'assets/game/sprite/vulture_sprite.json');
        this.game.load.atlasJSONArray('sparrow_flying', 'assets/game/sprite/sparrow_sprite.png', 'assets/game/sprite/sparrow_sprite.json');
        this.game.load.atlasJSONArray('goose_flying', 'assets/game/sprite/goose_sprite.png', 'assets/game/sprite/goose_sprite.json');
        this.game.load.atlasJSONArray('owl_flying', 'assets/game/sprite/owl_sprite.png', 'assets/game/sprite/owl_sprite.json');
        this.game.load.atlasJSONArray('duck_flying', 'assets/game/sprite/duck_sprite.png', 'assets/game/sprite/duck_sprite.json');
        this.game.load.atlasJSONArray('chicken_flying', 'assets/game/sprite/chicken_sprite.png', 'assets/game/sprite/chicken_sprite.json');

    }

    //gets executed after preload
    create(){
        console.log("create called");
        var s = this.game.add.sprite(0,0,'reinforest1');
        s.rotation = 0.0;
        //s.inputEnabled = true;
        //s.events.onInputDown.add(this.changeToAttack, this);

        //
        //var attackplant = this.game.add.sprite(-10, this.game.height-230, 'attackplant');
        //attackplant.animations.add('swim');
        //attackplant.animations.play('swim', 15, true);
        //attackplant.scale.setTo(1, 1);
        //this.game.inputEnabled = false;

        this.CANVAS_WIDTH = 382.0;
        if(window.innerWidth > this.CANVAS_WIDTH)
            this.CANVAS_WIDTH = window.innerWidth;

        
        //this.animateLionJump()
        //
        this.animateOstrich();
        //
        this.animateSquirrel();

        //
        console.log("adding thristy plant");
        var thirstyplant = this.game.add.sprite(-30, this.game.height-230, 'thirstyplant');
        thirstyplant.animations.add('swim');
        thirstyplant.animations.play('swim', 15, true);
        thirstyplant.scale.setTo(.9, .9);
        thirstyplant.inputEnabled = true;
        this.thirstyplant = thirstyplant;
        thirstyplant.events.onInputDown.addOnce(this.changeToAttack, this);
        //this.game.input.onDown.addOnce(this.changeToAttack, this);


        //
        
        console.log("adding corn");
        var corn = this.game.add.sprite(300, this.game.height-140, 'corn_stand');
        corn.animations.add('swim');
        corn.animations.play('swim', 5, true);
        corn.scale.setTo(-.8, .8);
        corn.inputEnabled = true;
        this.corn = corn;
        corn.events.onInputDown.addOnce(this.changeToAttackCorn, this);
        

        //add the rock to cover the carnivorous plant
        var journal = this.add.image(10, this.game.height - 95, 'rock2');
        //journal.scale.setTo(0.4, 0.4);
        journal.scale.setTo(.3,.18);

        //
        //
        this.lion = this.add.sprite(this.game.width-40, this.game.height-250, 'lion');
        this.animateLion();
        
        //
        this.koala = this.add.sprite(this.game.width-150, this.game.height-200, 'koala');
        this.animateKoala();

        //
        this.triceratops = this.add.sprite(this.game.width+50, this.game.height-240, 'triceratops');
        this.animateTriceratops();

        //
        this.animatePegions();

        //
        this.animateVulture();
        this.animateSparrow();
        this.animateGooseDuck();
        this.animateChicken();
        this.animateOwl();

        //
        this.inputEnabled = false;
        Phaser.Canvas.setTouchAction(this.game.canvas, "auto");
        this.game.input.touch.preventDefault = false;

        
        
    }

    //
    animateKoala(){
        console.log("Idle koala");
        this.koala.loadTexture('koala', 0);
        this.koala.animations.add('swim');
        this.koala.animations.play('swim', 2, true);
        this.koala.scale.setTo(-.3, .3);
        //this.triceratops.inputEnabled = true;
        //this.triceratops.events.onInputDown.addOnce(this.animateLionJump, this);
        this.koala.name = "koala";
    }


    //
    animateTriceratops(){
        console.log("Idle triceratops");
        this.triceratops.loadTexture('triceratops', 0);
        this.triceratops.animations.add('swim');
        this.triceratops.animations.play('swim', 2, true);
        this.triceratops.scale.setTo(-.4, .4);
        //this.triceratops.inputEnabled = true;
        //this.triceratops.events.onInputDown.addOnce(this.animateLionJump, this);
        this.triceratops.name = "triceratops";
        //this.pegions.body.velocity.x = -20;
        //this.gobothways(this.lion);
    }

    //
    animateLion(){
        console.log("Idle lion");
        this.lion.loadTexture('lion', 0);
        this.lion.animations.add('swim');
        this.lion.animations.play('swim', 3, true);
        this.lion.scale.setTo(-1, 1);
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
        this.lion.scale.setTo(-1, 1);
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
        this.clownFish = this.add.sprite(this.game.width+250, this.game.height-125, 'ostrich');
        this.clownFish.anchor.setTo(.5,.5);
        this.clownFish.animations.add('swim');
        this.clownFish.animations.play('swim', 10, true);
        this.clownFish.scale.setTo(0.5, 0.5);
        this.clownFish.name = "squirrel";
        this.gobothways(this.clownFish);


        //this.isPrawnAdded = true;
        //this.prawn = this.add.sprite(10, this.height-50, 'seacreatures', 'prawn0000');
        //this.prawn.scale.setTo(0.5, 0.5);
    }

    //if(this.totalPoints >= 0 && this.totalPoints < 25)
    animateSquirrel(){
        this.ostrich = this.add.sprite(-50, this.game.height-95, 'squirrel');
        this.ostrich.anchor.setTo(.5,.5);
        this.ostrich.animations.add('swim2');
        this.ostrich.animations.play('swim2', 25, true);
        this.ostrich.scale.setTo(-0.7, 0.7);
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

    

}