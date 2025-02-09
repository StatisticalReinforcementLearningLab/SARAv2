import { Component, OnInit } from '@angular/core';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-baseline-survey',
  templateUrl: './baseline-survey.component.html',
  styleUrls: ['./baseline-survey.component.scss'],
})
export class BaselineSurveyComponent implements OnInit {

  pastSurveyDate;
  response;
  previousDataAvailable;

  constructor(
    private userProfileService: UserProfileService,
    // private mobileAccessibility: MobileAccessibility,
    private EncrDecr: EncrDecrService,
    private uploadService: UploadserviceService,
    private menuCtrl:MenuController) { 

      this.pastSurveyDate = "2025-02-03"; 
      this.response = "response";
      this.previousDataAvailable = false;      
  }

  ngOnInit() {
    this.menuCtrl.close();
    // this.mobileAccessibility.usePreferredTextZoom(false);

    let localSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));
    if((window.localStorage.getItem("localSurvey") !== null) 
        && ("baseline_survey" in localSurvey)){
          this.previousDataAvailable = true; 

          //this.pastSurveyDate = localSurvey["baseline_survey"]["date"];
          

          var decryptedBaselineSurvey = JSON.parse(this.EncrDecr.decrypt(localSurvey["baseline_survey"]['encrypted'], environment.encyptString));
          console.log("decrypted " + JSON.stringify(decryptedBaselineSurvey));
          const keys = Object.keys(decryptedBaselineSurvey);
          this.response = "";

          this.pastSurveyDate = decryptedBaselineSurvey['ts'].split(",")[0];

          for (const key of keys) {
            if(key.includes("_value"))
              this.response = this.response + decryptedBaselineSurvey[key] + ", "; 
          }
          if(this.response == ""){
            this.previousDataAvailable = false;//there was no response. 
          }else{
            this.response = this.response.substring(0, this.response.length - 2);
            this.response = this.response.toLowerCase();
          }
    }
  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length);
     }
    });
    */
    console.log("Entered baseline survey");
    this.uploadService.saveAppUsageEnter("baseline_survey_page");
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
    // this.mobileAccessibility.usePreferredTextZoom(true);
    this.uploadService.saveAppUsageExit("baseline_survey_page");
 }

}
