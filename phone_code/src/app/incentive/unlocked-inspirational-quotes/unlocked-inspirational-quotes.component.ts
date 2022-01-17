import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-unlocked-inspirational-quotes',
  templateUrl: './unlocked-inspirational-quotes.component.html',
  styleUrls: ['./unlocked-inspirational-quotes.component.css']
})
export class UnlockedInspirationalQuotesComponent implements OnInit {

  unlockedInspirationalQuotes = [];

  constructor(
    private userProfileService: UserProfileService,
    private httpClient: HttpClient,
    private appUsageDb: DatabaseService
  ) { }


  get username(){
    if(this.userProfileService == undefined)
      return "test";
    else{
      return this.userProfileService.username;
    }
  }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    //pre-populate
    this.unlockedInspirationalQuotes = JSON.parse(window.localStorage.getItem("saved_quotes") || '[]');
    this.getInspirationalQuotes();

    //
    this.appUsageDb.saveAppUsageEnter("unlocked_inspirational_quote_tab"); 
  }

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });
    */ 
    this.appUsageDb.saveAppUsageExit("unlocked_inspirational_quote_tab");     
  }


  getInspirationalQuotes() {
    
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + '/get-inspirational-quote', { "user_id": this.username }).subscribe({
        next: data => {
          //console.log("Inspirational quote: " + JSON.stringify(data));
          var json_data = JSON.parse(JSON.stringify(data));
          this.unlockedInspirationalQuotes = [];
          for(var i=0; i < json_data.length;  i++){

            //exclude today if it is not yet 4PM.
            var todaysDate = moment().format('YYYYMMDD');
            if(json_data[i].date == todaysDate){
              var currentTime = moment(); 
              var startTime = moment({hour: 16});  // 6pm
              var endTime = moment({hour: 23, minute: 59, second: 59});  // 11:59pm
              if(!currentTime.isBetween(startTime, endTime)) 
                  continue;
            }

            //sometimes tomorrow can get scheduled as well
            var tomorrowsDate = moment().add(1,"days").format('YYYYMMDD');
            if(json_data[i].date == tomorrowsDate)
              continue;

            var date = json_data[i].date;
            date = date.substring(4, 6) + "/" + date.substring(6, 8) + "/" + date.substring(0, 4);

            this.unlockedInspirationalQuotes.push({
              "image": "https://aws-website-sara-ubicomp-h28yp.s3.amazonaws.com/sarapp/engagement_images/"  + json_data[i].image,
              "author": json_data[i].author,
              "quote_text": json_data[i].quote_text,
              "date": date
            });
          }
          window.localStorage.setItem('saved_quotes', JSON.stringify(this.unlockedInspirationalQuotes));
        },
        error: error => console.error('There was an error!', error)
    });
  }

}
