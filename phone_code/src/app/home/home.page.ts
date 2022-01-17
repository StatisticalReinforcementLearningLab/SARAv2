import { Component, OnInit, ViewChild} from '@angular/core';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';
import { UserProfileService } from '../user/user-profile/user-profile.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage  implements OnInit {

  isAYA: boolean;

  @ViewChild(AquariumComponent, {static: true}) child;

  constructor(
    private userProfileService: UserProfileService) { 

    this.isAYA = true;
    if(this.userProfileService.isParent == true)
      this.isAYA = false;

  }

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
