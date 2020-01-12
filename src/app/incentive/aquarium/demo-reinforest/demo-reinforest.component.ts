import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReinforestLevel1 } from './ReinforestLevel1';

declare let Phaser: any;

@Component({
  selector: 'app-demo-reinforest',
  templateUrl: './demo-reinforest.component.html',
  styleUrls: ['./demo-reinforest.component.scss'],
})
export class DemoReinforestComponent implements OnInit {

  game;
  thirstyplant;

  constructor(private router: Router) { 
    console.log("Constructor called");
    
    
    this.game =  new Phaser.Game(
      window.innerWidth, 515,
      Phaser.AUTO,
      'gameDiv'
    );

    this.game.state.add('ReinforestLevel1', ReinforestLevel1);
    this.game.state.start('ReinforestLevel1');
    //self = this;

    //this.game.state.states["GameSmall"].assignscope(this);
    
    
    //this.game = new Phaser.Game(1000, 515, Phaser.CANVAS, 'phaser-example', { preload: this.preload, create: this.create }); 
    
  
  }

  ionViewDidLeave(){
    this.game.destroy();
  }

  goToRewardsPage(){
    console.log("rewards page");
    this.router.navigate(['/home']);
  }
  



  ngOnInit() {}

}
