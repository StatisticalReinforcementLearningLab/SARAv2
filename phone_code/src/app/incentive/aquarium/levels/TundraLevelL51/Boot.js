export class BootTundraL51 extends Phaser.State {
    preload() {
        this.load.image('preloaderBar', 'assets/img/loader_bar.png');
    }
    
    create() {
		this.input.maxPointers = 1;
		//-- https://github.com/photonstorm/phaser-ce/issues/32
		if(this.game.device.touch){
			this.input.mouse.stop();
		}
		this.stage.disableVisibilityChange = false;
		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 400;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.stage.forcePortrait = true;
		//this.scale.setScreenSize(true);

		this.input.addPointer();

		//Change color here 
		//-- http://www.w3schools.com/colors/colors_picker.asp
		this.stage.backgroundColor = '#ffffff';
        
		this.state.start('Preloader');
		console.log("Boot completed");
	
    }
}