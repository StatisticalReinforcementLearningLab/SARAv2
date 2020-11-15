export class GameOver extends Phaser.State {
    //componentObject;
    constructor(){
        super();
        this.componentObject;
    }
    create() {
        this.stage.backgroundColor = '#000000';
        var s = this.add.sprite(this.world.centerX, this.world.centerY, 'GameOver');
        s.anchor.setTo(.5,.5);
    }

    update(){

    }

    assignscope(scope) {
        //this.ionic_scope = scope;
    }

}
