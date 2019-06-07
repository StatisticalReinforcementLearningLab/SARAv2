import { Component, OnInit } from '@angular/core';
import { SaveDataService } from '../save-data.service'

@Component({
  selector: 'app-activetask',
  templateUrl: './activetask.component.html',
  styleUrls: ['./activetask.component.scss'],
})
export class ActivetaskComponent implements OnInit {

  private count: number;

  constructor(private saveDataService: SaveDataService) { 
    this.count = 0;
  }

  ngOnInit() {}

  incrementCount(){
    this.count = this.count + 1;
  }

  storeData(){
    this.saveDataService.saveData("Count", this.count);
    this.count = 0;
  }
}
