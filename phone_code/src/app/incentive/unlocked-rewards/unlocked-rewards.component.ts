import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-unlocked-rewards',
  templateUrl: './unlocked-rewards.component.html',
  styleUrls: ['./unlocked-rewards.component.scss'],
})
export class UnlockedRewardsComponent implements OnInit {

  type = 'memes';
  already_shown_altruism_msgs: any;
  unlockedAltMessagesCount: number;
  list_of_alt_msg_to_display: any;

  already_shown_memes: any;
  list_of_meme_to_display: any;
  unlockedMemeCount: number;

  constructor() {
    this.type = "memes";
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail["value"]);
    this.type = ev.detail["value"];
  }


  ionViewDidEnter() {

    //alturistic message
    this.already_shown_altruism_msgs = window.localStorage["already_shown_alt_msg4"];

    if (this.already_shown_altruism_msgs == undefined) {
      this.already_shown_altruism_msgs = {
        "last_updated": Date.now(),
        "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
        "unlocked_alt_msgs": [{ "filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY') }]
      };
      window.localStorage["already_shown_alt_msg4"] = JSON.stringify(this.already_shown_altruism_msgs);
    } else
      this.already_shown_altruism_msgs = JSON.parse(window.localStorage["already_shown_alt_msg4"]);

    if (this.already_shown_altruism_msgs.unlocked_alt_msgs.length == 0) {
      this.already_shown_altruism_msgs = {
        "last_updated": Date.now(),
        "last_updated_readable_ts": moment().format("MMMM Do YYYY, h:mm:ss a Z"),
        "unlocked_alt_msgs": [{ "filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY') }]
      };
      window.localStorage["already_shown_alt_msg4"] = JSON.stringify(this.already_shown_altruism_msgs);
    }

    this.unlockedAltMessagesCount = this.already_shown_altruism_msgs.unlocked_alt_msgs.length;
    this.list_of_alt_msg_to_display = this.already_shown_altruism_msgs["unlocked_alt_msgs"];
    //this.list_of_alt_msg_to_display.reverse();
    console.log("already_shown_altruism_msgs " + this.already_shown_altruism_msgs);


    //meme
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

  }

  ngOnInit() { }

}
