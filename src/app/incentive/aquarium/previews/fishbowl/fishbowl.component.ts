import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-fishbowl',
  templateUrl: './fishbowl.component.html',
  styleUrls: ['./fishbowl.component.css']
})
export class FishbowlComponent implements OnInit {

  constructor(private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

}
