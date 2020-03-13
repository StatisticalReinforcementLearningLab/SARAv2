import { Component, OnInit } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-aya-sample-survey',
  templateUrl: './aya-sample-survey.component.html',
  styleUrls: ['./aya-sample-survey.component.scss'],
})
export class AyaSampleSurveyComponent implements OnInit {

  pageTitle = "Survey_aya";

  constructor(  
    private ga: GoogleAnalytics,
    private userProfileService: UserProfileService,
    private db: DatabaseService
) { }

  ngOnInit() {
    this.ga.trackView(this.pageTitle)
    .then(() => {console.log("trackView at Survey_aya!")})
    .catch(e => console.log('Error starting GoogleAnalytics == '+ e));
  }

  ionViewDidEnter(){
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
   }); 
 }  

 ionViewDidLeave(){
  console.log(this.pageTitle+": ionViewDidLeave");
  this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
   }); 
   
 }

}
