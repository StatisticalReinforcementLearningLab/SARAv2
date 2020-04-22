import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-unlocked-altuistic-messages',
  templateUrl: './unlocked-altuistic-messages.component.html',
  styleUrls: ['./unlocked-altuistic-messages.component.css']
})
export class UnlockedAltuisticMessagesComponent implements OnInit {
  already_shown_altruism_msgs: any;
  unlockedAltMessagesCount: number;


  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.already_shown_altruism_msgs = window.localStorage["already_shown_alt_msg3"];

    if(this.already_shown_altruism_msgs == undefined)
        this.already_shown_altruism_msgs = [{"filename": "assets/altruism/altruism_1.png", "unlock_date": moment().format('MM/DD/YYYY')}]
    else
        this.already_shown_altruism_msgs = JSON.parse(window.localStorage["already_shown_alt_msg3"]);

    this.unlockedAltMessagesCount = this.already_shown_altruism_msgs.length;

    this.already_shown_altruism_msgs.reverse();
    console.log(this.already_shown_altruism_msgs);
  }
}
