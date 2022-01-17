export class PreloaderGameOver extends Phaser.State {
	
	preload(){

		//
		this.load.image('GameOver', 'assets/img/Fireworks.png');

	}

	create(){
		console.log("Preloader: create called");
		//this.preloadBar.cropEnabled = false;
	}

	update()
	{
		//console.log("update: "+ this.pickedGame);
		this.state.start('GameOver');
	}

	onLoadComplete(){
	    console.log("Load complete");
	    this.ready = true;
	}
}