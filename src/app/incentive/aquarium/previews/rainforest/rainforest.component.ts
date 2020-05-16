import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-rainforest',
  templateUrl: './rainforest.component.html',
  styleUrls: ['./rainforest.component.css']
})
export class RainforestComponent implements OnInit {

  constructor(private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }


}
