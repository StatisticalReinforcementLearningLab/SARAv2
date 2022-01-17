import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tundra',
  templateUrl: './tundra.component.html',
  styleUrls: ['./tundra.component.css']
})
export class TundraComponent implements OnInit {

  constructor(private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

}
