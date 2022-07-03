import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-sleep-study-evening-survey',
  templateUrl: './sleep-study-evening-survey.component.html',
  styleUrls: ['./sleep-study-evening-survey.component.css']
})
export class SleepStudyEveningSurveyComponent implements OnInit {

  whichImage;

  constructor(private userProfileService: UserProfileService,
    private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService) { }

  ngOnInit() {
    this.mobileAccessibility.usePreferredTextZoom(false);
    this.whichImage = "https://sara-public.s3.amazonaws.com/survey_images/gracie_sleep.jpg";
  }

  ionViewDidEnter(){
    /* 
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
    });
    */
    this.appUsageDb.saveAppUsageEnter("sleep_evening_survey_page");
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
      this.appUsageDb.saveAppUsageExit("sleep_evening_survey_page");
  }
}
