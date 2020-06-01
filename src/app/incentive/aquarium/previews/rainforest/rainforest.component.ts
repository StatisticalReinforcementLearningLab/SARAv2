import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { DemoAquariumComponent } from '../../demo-aquarium/demo-aquarium.component';
import { interval } from 'rxjs';


@Component({
  selector: 'app-rainforest',
  templateUrl: './rainforest.component.html',
  styleUrls: ['./rainforest.component.css']
})
export class RainforestComponent implements OnInit, AfterViewInit {

  @ViewChild(DemoAquariumComponent, {static: true}) child;
  constructor(private menuCtrl:MenuController,
    public navController: NavController) { 
  }

  ngOnInit() {
    this.menuCtrl.close();
  }

  goHome(){
    this.child.ionViewDidLeaveFunction();
    // Create an Observable that will publish a value on an interval
    const secondsCounter2 = interval(1000).subscribe(n =>{
      console.log(`It's been ${n} seconds since subscribing!`);
      secondsCounter2.unsubscribe();
      this.navController.navigateRoot(['/home']);
    });
  }

  ionViewDidEnter() {
    console.log("aqarium.ts --- ionViewDidEnter");
    //this.child.loadFunction();
  }

  ngAfterViewInit(){
    console.log("aqarium.ts --- ngAfterInit");
    console.log("aqarium.ts --- " + this.child);
    //this.child.loadFunction();

    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000).subscribe(n =>{
      console.log(`It's been ${n} seconds since subscribing!`);
      secondsCounter.unsubscribe();
      this.child.loadFunction();
    });
    
  }

  

}
