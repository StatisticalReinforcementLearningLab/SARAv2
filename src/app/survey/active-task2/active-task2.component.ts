import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SaveDataService } from '../save-data.service'
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';

@Component({
  selector: 'app-active-task2',
  templateUrl: './active-task2.component.html',
  styleUrls: ['./active-task2.component.scss'],
})
export class ActiveTask2Component implements OnInit {

  count: number;
  timeDuration: number;
  hidevalue: boolean;
  tapcount : number;
  tap_data_left: any;
  tap_data_right: any; 
  timer: any;

  constructor(private saveDataService: SaveDataService,
    private storeToFirebaseService: StoreToFirebaseService) {
    this.count = 0;
    this.timeDuration = 10;
    this.hidevalue = false;
    this.tapcount = 0;
    this.tap_data_left = [];
    this.tap_data_right = [];

   }

  ngOnInit() {}

  start(){
      this.timer = setTimeout(x => 
        {
            if(this.timeDuration <= 0) { }
            this.timeDuration -= 1;
  
            if(this.timeDuration>0){
              this.hidevalue = false;
              this.start();
            }           
            else{
                this.hidevalue = true;
                this.storeData();
            }
  
        }, 1000); 
  }
  

  leftTapped(){
    this.tapcount = this.tapcount + 1;
    this.tap_data_left.push(new Date().getTime());
  }

  rightTapped(){
    this.tapcount = this.tapcount + 1;
    this.tap_data_right.push(new Date().getTime());
  }

  storeData(){
    var tapping_data = {};
    //tapping_data['ts'] = new Date().getTime();
    tapping_data['readableTs'] = moment().format('MMMM Do YYYY, h:mm:ss a ZZ');
    tapping_data['tapCount'] = this.tapcount;
    tapping_data['left'] = this.tap_data_left;
    tapping_data['right'] = this.tap_data_right;

    //var at_data = JSON.parse(localStorage.getItem['activetasks_data_today'] || '[]');
    //at_data.push(tapping_data);
  
    this.saveDataService.saveData("activetasks_data_today", JSON.stringify(tapping_data));
    this.storeToFirebaseService.addSurvey('/activetasks2_data', tapping_data);
    this.saveDataService.browseToReward('/incentive/award-memes');

  }
}
