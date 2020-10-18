import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
})
export class InfoPageComponent implements OnInit {

  isAYA: boolean;

  constructor(private menuCtrl:MenuController,
    private appUsageDb: DatabaseService,
    private userProfileService: UserProfileService) { }

    
  ngOnInit() {

    this.isAYA = true;
    this.menuCtrl.close();
  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
    });
    */

    //
    if((this.userProfileService != undefined)  && (this.userProfileService.isParent == true))
      this.isAYA = false;
    
    this.appUsageDb.saveAppUsageEnter("reward_info_page");  
  }  

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });
    */ 
    this.appUsageDb.saveAppUsageExit("reward_info_page");     
  }

}
