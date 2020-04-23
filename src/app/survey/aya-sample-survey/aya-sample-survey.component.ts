import { Component, OnInit } from '@angular/core';
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
    private userProfileService: UserProfileService,
    private db: DatabaseService) { }

  ngOnInit() {

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
