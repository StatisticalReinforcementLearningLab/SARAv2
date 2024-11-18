import { Component, OnInit } from '@angular/core';
//import { PreLoad } from '../../PreLoad';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

@Component({
  selector: 'app-sample-survey',
  templateUrl: './sample-survey.component.html',
  styleUrls: ['./sample-survey.component.scss'],
})

//@PreLoad('life-insights')
export class SampleSurveyComponent implements OnInit {
  pageTitle = "Survey_caregiver";

  constructor(
    private userProfileService: UserProfileService,
    // private mobileAccessibility: MobileAccessibility,
    private uploadService: UploadserviceService
  ) { }

  ngOnInit() {
    // this.mobileAccessibility.usePreferredTextZoom(false);
  }

  ionViewDidEnter(){
    //
    this.uploadService.saveAppUsageEnter("cg_survey_page");

 }

 ionViewDidLeave(){
    //
    // this.mobileAccessibility.usePreferredTextZoom(true);
    this.uploadService.saveAppUsageExit("cg_survey_page");

 }

}
