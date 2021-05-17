import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-dogs-survey',
  templateUrl: './dogs-survey.component.html',
  styleUrls: ['./dogs-survey.component.css']
})

export class DogsSurveyComponent implements OnInit {

  whichImage;

  constructor(private userProfileService: UserProfileService,
    private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService) { }

    ngOnInit() {
      this.mobileAccessibility.usePreferredTextZoom(false);
      this.whichImage = "https://sara-template-data-storage.s3.amazonaws.com/notification_images/gracie_guilty.jpg";
    }
  
    ionViewDidEnter(){

      /* 
      this.db.getDatabaseState().subscribe(rdy => {
       if (rdy) {     
         this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
       }
      });
      */
      
      this.appUsageDb.saveAppUsageEnter("dogs_survey_page");

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
      this.appUsageDb.saveAppUsageExit("dogs_survey_page");
    
   }

}