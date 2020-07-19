import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-unlocked-memes',
  templateUrl: './unlocked-memes.component.html',
  styleUrls: ['./unlocked-memes.component.css']
})
export class UnlockedMemesComponent implements OnInit {
  already_shown_memes: any;
  list_of_meme_to_display: any;
  unlockedMemeCount: number;

  constructor(private userProfileService: UserProfileService,
    private httpClient: HttpClient,
    private appUsageDb: DatabaseService) { 
  }

  get username(){
    if(this.userProfileService == undefined)
      return "test";
    else{
      return this.userProfileService.username;
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
    this.already_shown_memes = window.localStorage["already_shown_memes4"];

    if(this.already_shown_memes == undefined){
        this.already_shown_memes = {
            "last_updated": Date.now(),
            "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
            "unlocked_memes":[{"filename": "assets/memes/4.jpg", "unlock_date": moment().format('MM/DD/YYYY')}]
        };
        window.localStorage["already_shown_memes4"] = JSON.stringify(this.already_shown_memes);
    }else
        this.already_shown_memes = JSON.parse(window.localStorage["already_shown_memes4"]);

    if(this.already_shown_memes.unlocked_memes.length == 0){
          this.already_shown_memes = {
              "last_updated": Date.now(),
              "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
              "unlocked_memes":[{"filename": "assets/memes/4.jpg", "unlock_date": moment().format('MM/DD/YYYY')}]
          };
          window.localStorage["already_shown_memes4"] = JSON.stringify(this.already_shown_memes);
    }


    this.unlockedMemeCount = this.already_shown_memes["unlocked_memes"].length;

    //var unlockedMemeUnorderDateList = this.already_shown_memes["unlocked_memes"];
    //for(var key in unlockedMemeUnorderDateList)
    //  unlockedMemesOrderedByDate[unionOfLocalAndServer[key]["unlock_date"]] = unionOfLocalAndServer[key];
    //console.log("unlockedMemeUnorderDateList " + JSON.stringify(unlockedMemeUnorderDateList.reverse()));
          
    this.list_of_meme_to_display = this.already_shown_memes["unlocked_memes"];
    //this.list_of_meme_to_display.reverse();
    console.log("already_shown_memes " + JSON.stringify(this.already_shown_memes));

    
    this.downloadAndUpdateUnlockedMemeList();

    //
    this.appUsageDb.saveAppUsageEnter("unlocked_meme_tab"); 
  }

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });
    */ 
    this.appUsageDb.saveAppUsageExit("unlocked_meme_tab");     
  }

  
  async downloadAndUpdateUnlockedMemeList() {
    
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + '/get-unlocked-incentive', { "user_id": this.username, "incentive_type": "meme" }).subscribe({
        next: data => {

          var json_data = JSON.parse(JSON.stringify(data));

          /*
          
          Sample of returned data

          {
            "last_updated": 1591509230223,
            "last_updated_readable_ts": "June 6th 2020, 10:53:50 pm -07:00",
            "unlocked_memes": [
                {
                    "filename": "assets/memes/4.jpg",
                    "unlock_date": "06/06/2020"
                }
            ]
          }
          */

          var lastUpdatedSeverSide: number;
          var lastUpdatedReadableTsSeverSide: any;
          var unlockedMemesServerSide: any;
          if("last_updated" in json_data){
              lastUpdatedSeverSide = json_data["last_updated"];
              lastUpdatedReadableTsSeverSide = json_data["last_updated_readable_ts"];
              unlockedMemesServerSide = json_data["unlocked_memes"];
              //console.log("--unlockedMemesServerSide--- " + JSON.stringify(unlockedMemesServerSide));
          }else{
              lastUpdatedSeverSide = -1;
              lastUpdatedReadableTsSeverSide = -1;
              unlockedMemesServerSide = [];
              //console.log("--unlockedMemesServerSide--- " + JSON.stringify(unlockedMemesServerSide));
          }

          var localMemeRecord = JSON.parse(window.localStorage["already_shown_memes4"]);
          var lastUpdatedLocalStorage = localMemeRecord["last_updated"];
          var lastUpdatedReadableTsLocalStorage = localMemeRecord["last_updated_readable_ts"];
          var unlockedMemesLocalStorage = localMemeRecord["unlocked_memes"];
          //console.log("--unlockedMemesLocalStorage--- " + JSON.stringify(unlockedMemesLocalStorage));


          //Following code creates a union of unlockedMemesServerSide and unlockedMemesLocalStorage
          var unionOfLocalAndServer = {};
          
          
          for(var i=0; i < unlockedMemesServerSide.length; i++)
              unionOfLocalAndServer[unlockedMemesServerSide[i]["filename"]] = unlockedMemesServerSide[i];
          for(var i=0; i < unlockedMemesLocalStorage.length; i++)
              unionOfLocalAndServer[unlockedMemesLocalStorage[i]["filename"]] = unlockedMemesLocalStorage[i];

          //
          var unlockedMemesOrderedByDate = {};
          for(var key in unionOfLocalAndServer)
            unlockedMemesOrderedByDate[unionOfLocalAndServer[key]["unlock_date"]] = unionOfLocalAndServer[key];
          


          //console.log("--unlockedMemesOrderedByDate--- " + JSON.stringify(unlockedMemesOrderedByDate));
          var res = []
          var sortedDates = Object.keys(unlockedMemesOrderedByDate).sort();
          for (var k=0; k < sortedDates.length; k++){
              res.push(unlockedMemesOrderedByDate[sortedDates[k]]);
          }
          //console.log("--sortedDates--- " + JSON.stringify(sortedDates));
          this.list_of_meme_to_display = res.reverse();
          this.unlockedMemeCount = res.length;


          localMemeRecord["unlocked_memes"] = this.list_of_meme_to_display;
          localMemeRecord["last_updated"] = Date.now();
          localMemeRecord["last_updated_readable_ts"] = moment().format("MMMM Do YYYY, h:mm:ss a Z");
          window.localStorage["already_shown_memes4"] = JSON.stringify(localMemeRecord);

          //console.log("--localMemeRecord--- " + JSON.stringify(localMemeRecord));
          //
          this.uploadCurrentlyUnlockedMemeList(localMemeRecord);
        },
        error: error => console.error('There was an error!', error)
    });
  }
  

  uploadCurrentlyUnlockedMemeList(already_shown_memes){

    /*
      {
        "user_id": "test",
        "incentiveString": "test",
        "whenInserted": "test",
        "whenInsertedReadableTs": 1234,
        "incentiveType": "test"
      }
    */

    var username = this.userProfileService.username;
    var currentTimeTs = Date.now();
    var currentTimeReadableTs = moment().format("MMMM Do YYYY, h:mm:ss a Z");
    const headers = { "Content-Type": "application/json;charset=UTF-8"};
    const body = {
                    "user_id": username, 
                    "whenInserted": currentTimeTs, 
                    "whenInsertedReadableTs": currentTimeReadableTs,
                    "incentiveType": "meme",
                    "incentiveString": JSON.stringify(already_shown_memes)
                };
 
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + "/store-unlocked-incentive", body)
      .subscribe({
        next: data => console.log("--unlocked_meme-- " + JSON.stringify(data)),
        error: error => console.error('There was an error!', error)
    });
  }


}
