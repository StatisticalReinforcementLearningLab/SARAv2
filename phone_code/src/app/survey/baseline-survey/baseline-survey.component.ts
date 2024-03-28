import { Component, OnInit } from '@angular/core';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-baseline-survey',
  templateUrl: './baseline-survey.component.html',
  styleUrls: ['./baseline-survey.component.scss'],
})
export class BaselineSurveyComponent implements OnInit {

  constructor(
    private userProfileService: UserProfileService,
    private mobileAccessibility: MobileAccessibility,
    private appUsageDb: DatabaseService,
    private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
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
    console.log("Entered baseline survey");
    this.appUsageDb.saveAppUsageEnter("baseline_survey_page");
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
    this.appUsageDb.saveAppUsageExit("baseline_survey_page");
 }

}
