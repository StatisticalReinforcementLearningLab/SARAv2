import { Component, ViewChild, OnInit } from '@angular/core';
import { DemoAquariumComponent } from '../incentive/aquarium/demo-aquarium/demo-aquarium.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

//@PreLoad('aquarium')
export class HomePage implements OnInit {

  private sub1$:any;
  private sub2$:any;
  money = 0;

  @ViewChild(DemoAquariumComponent, {static: true}) child;

  constructor(private platform: Platform) { 
    console.log("Constructor called");
    this.sub1$=this.platform.pause.subscribe(() => {        
      console.log('****UserdashboardPage PAUSED****');
      this.child.pauseGameRendering();
    });  
    this.sub2$=this.platform.resume.subscribe(() => {      
      console.log('****UserdashboardPage RESUMED****');
      this.child.resumeGameRendering();
    });
      
  }

  ionViewDidLeave(){
    console.log("ionDidLeave");
    this.child.ionViewDidLeaveFunction();
  }

  ionViewDidEnter() {
    this.child.loadFunction();
  }

  ionViewWillUnload() {
    this.sub1$.unsubscribe();
    this.sub2$.unsubscribe();
  }

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }
  
}
