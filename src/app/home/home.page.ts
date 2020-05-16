import { Component, OnInit, ViewChild} from '@angular/core';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  implements OnInit {

  @ViewChild(AquariumComponent, {static: true}) child;

  ngOnInit(): void {
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnterFunction");
    //this.child.ionViewDidEnterFunction();
  }


  ionViewDidLeave(){
    console.log("ionViewDidLeaveFunction");
    //this.child.ionViewDidLeaveFunction();
  }

}
