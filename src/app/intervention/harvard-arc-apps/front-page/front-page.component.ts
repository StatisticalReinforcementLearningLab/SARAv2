import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']

})
export class FrontPageComponent implements OnInit {

  jsonFileLinkForSurvey = "arc_apps";

  constructor(private router: Router, 
    public navController: NavController,
    private menuCtrl:MenuController) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

  ngAfterViewInit() {
    this.fetchARCApps(); 
  }

  goHome(){
    this.navController.navigateRoot(['home']);
  }

  fetchARCApps() {
    let app_list = [];
    fetch('../../../assets/data/' + this.jsonFileLinkForSurvey + '.json').then(async res => {
      this.app_list = await res.json();
      return app_list;
    })
    .then(data => console.log(data));
  }

  visitTheURL(url){
    console.log("visitTheURL");
    window.open(url, '_system', 'location=yes'); 
    return false;
  }
}
