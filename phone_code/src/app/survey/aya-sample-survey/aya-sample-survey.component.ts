import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

@Component({
  selector: 'app-aya-sample-survey',
  templateUrl: './aya-sample-survey.component.html',
  styleUrls: ['./aya-sample-survey.component.scss'],
})
export class AyaSampleSurveyComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    // private mobileAccessibility: MobileAccessibility,
    private uploadService: UploadserviceService) { }

  ngOnInit() {
    // this.mobileAccessibility.usePreferredTextZoom(false);
  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length);
     }
    });
    */
    this.uploadService.saveAppUsageEnter("aya_survey_page");

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
    this.uploadService.saveAppUsageExit("aya_survey_page");

 }

}
