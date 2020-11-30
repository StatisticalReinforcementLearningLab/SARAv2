import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-sleep-survey',
  templateUrl: './sleep-survey.component.html',
  styleUrls: ['./sleep-survey.component.css']
})

export class SleepSurveyComponent implements OnInit {

  whichImage;

  constructor(private userProfileService: UserProfileService,
    private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService) { }

    ngOnInit() {
      this.mobileAccessibility.usePreferredTextZoom(false);
      this.whichImage = "http://127.0.0.1:5000/plot.png";
    }
  
    ionViewDidEnter(){

      /* 
      this.db.getDatabaseState().subscribe(rdy => {
       if (rdy) {     
         this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
       }
      });
      */
      
      this.appUsageDb.saveAppUsageEnter("sleep_survey_page");

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
      this.appUsageDb.saveAppUsageExit("sleep_survey_page");
    
   }

}
