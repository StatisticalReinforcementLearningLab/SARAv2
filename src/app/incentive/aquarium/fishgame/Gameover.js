FishGame.Gameover = function(game) {
    this.game = game;
};


FishGame.Gameover.prototype = {
    
    create: function() {
        this.stage.backgroundColor = '#000000';
        var s = this.add.sprite(this.world.centerX, this.world.centerY, 'gameover');
        s.anchor.setTo(.5,.5);
    },

    update: function() {
        //console.log("coming here");
        //if(this.isPaused == false)
        //    this.filter.update(this.game.input.activePointer);
    }

};