import { Component, OnInit } from '@angular/core';
import { SaveDataService } from '../save-data.service'
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';

@Component({
  selector: 'app-activetask',
  templateUrl: './activetask.component.html',
  styleUrls: ['./activetask.component.scss'],
})
export class ActivetaskComponent implements OnInit {

  private count: number;

  constructor(private saveDataService: SaveDataService,
    private storeToFirebaseService: StoreToFirebaseService) { 
    this.count = 0;
  }

  ngOnInit() {}

  incrementCount(){
    this.count = this.count + 1;
  }

  storeData(){
    this.saveDataService.saveData("Count", this.count);
    var countObj = {"count": this.count};
    this.storeToFirebaseService.addSurvey('/counts', countObj);
    this.count = 0;
    this.saveDataService.browseToReward('/incentive/award');
  }

}
