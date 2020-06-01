import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
})
export class InfoPageComponent implements OnInit {

  constructor(private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

}
