import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/monitor/database.service';

@Component({
  selector: 'app-unlocked-altuistic-messages',
  templateUrl: './unlocked-altuistic-messages.component.html',
  styleUrls: ['./unlocked-altuistic-messages.component.css']
})
export class UnlockedAltuisticMessagesComponent implements OnInit {
  already_shown_altruism_msgs: any;
  unlockedAltMessagesCount: number;
  list_of_alt_msg_to_display: any;

  constructor(private userProfileService: UserProfileService,
    private httpClient: HttpClient,
    private appUsageDb: DatabaseService) { }

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
    this.already_shown_altruism_msgs = window.localStorage["already_shown_alt_msg4"];

    if(this.already_shown_altruism_msgs == undefined){
        this.already_shown_altruism_msgs = {
          "last_updated": Date.now(),
          "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
          "unlocked_alt_msgs":[{"filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY')}]
        };
        window.localStorage["already_shown_alt_msg4"] = JSON.stringify(this.already_shown_altruism_msgs);
    }else
        this.already_shown_altruism_msgs = JSON.parse(window.localStorage["already_shown_alt_msg4"]);

    if(this.already_shown_altruism_msgs.unlocked_alt_msgs.length == 0){
      this.already_shown_altruism_msgs = {
          "last_updated": Date.now(),
          "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
          "unlocked_alt_msgs":[{"filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY')}]
      };
      window.localStorage["already_shown_alt_msg4"] = JSON.stringify(this.already_shown_altruism_msgs);
    }

    this.unlockedAltMessagesCount = this.already_shown_altruism_msgs.unlocked_alt_msgs.length;
    this.list_of_alt_msg_to_display = this.already_shown_altruism_msgs["unlocked_alt_msgs"];
    //this.list_of_alt_msg_to_display.reverse();
    console.log("already_shown_altruism_msgs " + this.already_shown_altruism_msgs);

    this.downloadAndUpdateUnlockedAltsMsgsList();

    //
    this.appUsageDb.saveAppUsageEnter("unlocked_altruism_message_tab");  
  }

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });
    */ 
    this.appUsageDb.saveAppUsageExit("unlocked_altruism_message_tab");     
  }

  async downloadAndUpdateUnlockedAltsMsgsList() {
    
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + '/get-unlocked-incentive', { "user_id": this.username, "incentive_type": "alt_msg" }).subscribe({
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
          var unlockedAltMsgsServerSide: any;
          if("last_updated" in json_data){
              lastUpdatedSeverSide = json_data["last_updated"];
              lastUpdatedReadableTsSeverSide = json_data["last_updated_readable_ts"];
              unlockedAltMsgsServerSide = json_data["unlocked_alt_msgs"];
              console.log("--unlockedAltMsgsServerSide--- " + JSON.stringify(unlockedAltMsgsServerSide));
          }else{
              lastUpdatedSeverSide = -1;
              lastUpdatedReadableTsSeverSide = -1;
              unlockedAltMsgsServerSide = [];
              console.log("--unlockedAltMsgsServerSide--- " + JSON.stringify(unlockedAltMsgsServerSide));
          }

          var localAltMsgsRecord = JSON.parse(window.localStorage["already_shown_alt_msg4"]);
          var lastUpdatedLocalStorage = localAltMsgsRecord["last_updated"];
          var lastUpdatedReadableTsLocalStorage = localAltMsgsRecord["last_updated_readable_ts"];
          var unlockedAltMsgLocalStorage = localAltMsgsRecord["unlocked_alt_msgs"];
          console.log("--unlockedAltMsgLocalStorage--- " + JSON.stringify(unlockedAltMsgLocalStorage));


          //Following code creats a union of unlockedMemesServerSide and unlockedMemesLocalStorage
          var unionOfLocalAndServer = {};
          for(var i=0; i < unlockedAltMsgsServerSide.length; i++)
              unionOfLocalAndServer[unlockedAltMsgsServerSide[i]["filename"]] = unlockedAltMsgsServerSide[i];
          for(var i=0; i < unlockedAltMsgLocalStorage.length; i++)
              unionOfLocalAndServer[unlockedAltMsgLocalStorage[i]["filename"]] = unlockedAltMsgLocalStorage[i];

          //console.log("--unionOfLocalAndServer--- " + JSON.stringify(unionOfLocalAndServer));

          //
          var unlockedAltMessagesOrderedByDate = {};
          for(var key in unionOfLocalAndServer)
            unlockedAltMessagesOrderedByDate[unionOfLocalAndServer[key]["unlock_date"]] = unionOfLocalAndServer[key];
          
          var res = []
          for (var k in unlockedAltMessagesOrderedByDate) {
              res.push(unlockedAltMessagesOrderedByDate[k]);
          }
          this.list_of_alt_msg_to_display = res.reverse();
          this.unlockedAltMessagesCount = res.length;


          localAltMsgsRecord["unlocked_alt_msgs"] = this.list_of_alt_msg_to_display;
          localAltMsgsRecord["last_updated"] = Date.now();
          localAltMsgsRecord["last_updated_readable_ts"] = moment().format("MMMM Do YYYY, h:mm:ss a Z");
          window.localStorage["already_shown_alt_msg4"] = JSON.stringify(localAltMsgsRecord);

          //console.log("--localAltMsgsRecord--- " + JSON.stringify(localAltMsgsRecord));
          //
          this.uploadCurrentlyUnlockedAltMsgsList(localAltMsgsRecord);
        },
        error: error => console.error('There was an error!', error)
    });
  }

  uploadCurrentlyUnlockedAltMsgsList(already_shown_alt_msgs){

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
                    "incentiveType": "alt_msg",
                    "incentiveString": JSON.stringify(already_shown_alt_msgs)
                };
 
    var flaskServerAPIEndpoint = environment.flaskServerForIncentives;
    this.httpClient.post(flaskServerAPIEndpoint + "/store-unlocked-incentive", body)
      .subscribe({
        next: data => console.log("--unlocked_alt_msg-- " + JSON.stringify(data)),
        error: error => console.error('There was an error!', error)
    });
  }
}
