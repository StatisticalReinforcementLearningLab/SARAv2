import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sample-python-view',
  templateUrl: './sample-python-view.component.html',
  styleUrls: ['./sample-python-view.component.css']
})
export class SamplePythonViewComponent implements OnInit {
  helpUrl: any;
  whichImage;

  constructor(private menuCtrl:MenuController,
    private appUsageDb: DatabaseService,
    private sanitizer: DomSanitizer) { 

  }

  ngOnInit() {
    this.menuCtrl.close();


    /*
    const browser = this.iab.create('https://cnn.com/');

    //browser.executeScript(...);

    //browser.insertCSS(...);
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    browser.close();
    */

    ////'http://54.146.43.246:5000/'
    this.helpUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://127.0.0.1:5000/showplot'
    );

    this.whichImage = "http://127.0.0.1:5000/plot.png";
  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
    });
    */
    this.appUsageDb.saveAppUsageEnter("python_life_insight_page_sample");  
  }  

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {     
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
      }
    });
    */ 
    this.appUsageDb.saveAppUsageExit("python_life_insight_page_sample");     
  }

}