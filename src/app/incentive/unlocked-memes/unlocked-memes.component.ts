import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-unlocked-memes',
  templateUrl: './unlocked-memes.component.html',
  styleUrls: ['./unlocked-memes.component.css']
})
export class UnlockedMemesComponent implements OnInit {
  already_shown_memes: any;
  unlockedMemeCount: number;

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
    this.already_shown_memes = window.localStorage["already_shown_memes3"];

    if(this.already_shown_memes == undefined)
        this.already_shown_memes = [{"filename": "assets/memes/4.jpg", "unlock_date": moment().format('MM/DD/YYYY')}]
    else
        this.already_shown_memes = JSON.parse(window.localStorage["already_shown_memes3"]);

    this.unlockedMemeCount = this.already_shown_memes.length;

    this.already_shown_memes.reverse();
    console.log(this.already_shown_memes);

  }

}
