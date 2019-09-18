import { Component, OnInit } from '@angular/core';
import { Boot } from '../fishgame/Boot';
import { Preloader } from '../fishgame/Preloader';
import { GameSmall } from '../fishgame/GamesSmall2';
import { GameOver } from '../fishgame/GameOver';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare let Phaser: any;

@Component({
  selector: 'app-demo-aquarium',
  templateUrl: './demo-aquarium.component.html',
  styleUrls: ['./demo-aquarium.component.scss'],
})
export class DemoAquariumComponent implements OnInit {

  game;

  constructor(private router: Router) { 
    console.log("Constructor called");
    
    this.game =  new Phaser.Game(
      window.innerWidth, 700,
      Phaser.AUTO,
      'gameDiv'
    );
    this.game.state.add('Boot', Boot);
    this.game.state.add('Preloader', Preloader);
    this.game.state.add('GameSmall', GameSmall);
    this.game.state.add('GameOver', GameOver);
    this.game.state.start('Boot');
    //self = this;

    this.game.state.states["GameSmall"].assignscope(this);

  }


  goToRewardsPage(){
    console.log("rewards page");
    this.router.navigate(['/home']);
  }
  

  //preload the images
  preload(){
    console.log("Preload called");
    this.game.load.image('einstein','assets/pics/ra_einstein.png');
  }

  //gets executed after preload
  create(){
    console.log("create called");
    var s = this.game.add.sprite(80,9,'einstein');
    s.rotation = 0.14;
  }

  ngOnInit() {}

}
