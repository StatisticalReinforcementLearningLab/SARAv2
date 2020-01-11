import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TundraLevel1 } from './Tundra1';
import { Platform } from '@ionic/angular';

declare let Phaser: any;

@Component({
  selector: 'app-demo-tundra',
  templateUrl: './demo-tundra.component.html',
  styleUrls: ['./demo-tundra.component.scss'],
})
export class DemoTundraComponent implements OnInit {

  game;

  constructor(private platform: Platform, private router: Router) { 

    console.log("Constructor called");
    //this.game.destroy();
    

  }

  ngOnInit() {
    //
    this.loadFunction();
  }

  loadFunction(){

        //height adjustment for different phone types
        var GameApp = GameApp || {};
        GameApp.CANVAS_WIDTH = 382.0;
        console.log("w: " + window.innerWidth + ", h: " + window.innerHeight + ", dp: " + window.devicePixelRatio);
        if(window.innerWidth > GameApp.CANVAS_WIDTH)
            GameApp.CANVAS_WIDTH = window.innerWidth;
        GameApp.CANVAS_HEIGHT = window.innerHeight;
    
        //var game;
        if(this.platform.is('ios')){
            if(GameApp.CANVAS_HEIGHT < 642.0)//iphone SE fix.
                GameApp.CANVAS_HEIGHT += 60;
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 21*window.devicePixelRatio, Phaser.AUTO, 'gameDiv');
        }else if(this.platform.is('android'))
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 74, Phaser.AUTO, 'gameDiv');    
        else
            this.game = new Phaser.Game(GameApp.CANVAS_WIDTH, GameApp.CANVAS_HEIGHT - 100, Phaser.AUTO, 'gameDiv');
    
        
        var tundraLevel1 = new TundraLevel1();
        this.game.state.add('Tundra1', tundraLevel1);
        this.game.state.start('Tundra1');
  }

  goToRewardsPage(){
    console.log("rewards page");
    this.router.navigate(['/home']);
  }


  ionViewDidLeaveFunction(){
    console.log("Tundra, ionDidLeave");
    this.game.destroy();
  }



}
