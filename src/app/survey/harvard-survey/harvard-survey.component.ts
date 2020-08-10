import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-harvard-survey',
  templateUrl: './harvard-survey.component.html',
  styleUrls: ['./harvard-survey.component.css']
})
export class HarvardSurveyComponent implements OnInit {

  constructor(private userProfileService: UserProfileService,
    private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService) { }

    ngOnInit() {
      this.mobileAccessibility.usePreferredTextZoom(false);
    }
  
    ionViewDidEnter(){
      /*
      this.db.getDatabaseState().subscribe(rdy => {
       if (rdy) {     
         this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
       }
      });
      */
      this.appUsageDb.saveAppUsageEnter("harvard_survey_page");
   }  
  
   ionViewDidLeave(){
      /*
      console.log(this.pageTitle+": ionViewDidLeave");
      this.db.getDatabaseState().subscribe(rdy => {
        if (rdy) {     
          this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
        }
      });
      */    
      this.mobileAccessibility.usePreferredTextZoom(true);
      this.appUsageDb.saveAppUsageExit("harvard_survey_page");
    
   }

}
