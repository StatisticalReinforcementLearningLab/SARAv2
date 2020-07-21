import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

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
