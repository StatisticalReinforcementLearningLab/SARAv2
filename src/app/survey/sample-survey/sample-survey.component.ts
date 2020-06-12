import { Component, OnInit } from '@angular/core';
//import { PreLoad } from '../../PreLoad';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

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
    //private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService
  ) { }

  ngOnInit() {
    //this.mobileAccessibility.usePreferredTextZoom(false);

  }
  
  ionViewDidEnter(){
    //
    this.appUsageDb.saveAppUsageEnter("cg_survey_page"); 

 }  

 ionViewDidLeave(){
    //
    this.appUsageDb.saveAppUsageExit("cg_survey_page");   

 }

}
