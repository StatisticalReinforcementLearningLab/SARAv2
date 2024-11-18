import { Component, OnInit } from '@angular/core';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-baseline-survey',
  templateUrl: './baseline-survey.component.html',
  styleUrls: ['./baseline-survey.component.scss'],
})
export class BaselineSurveyComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    // private mobileAccessibility: MobileAccessibility,
    private uploadService: UploadserviceService,
    private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
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
