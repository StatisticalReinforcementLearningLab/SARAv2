import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as data from './arc_apps.json';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']

})
export class FrontPageComponent implements OnInit {

  products: any = (data as any).default;

  constructor(private router: Router, 
    public navController: NavController,
    private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

  goHome(){
    this.navController.navigateRoot(['home']);
  }

}