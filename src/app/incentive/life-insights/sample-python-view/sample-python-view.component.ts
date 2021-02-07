import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-sample-python-view',
  templateUrl: './sample-python-view.component.html',
  styleUrls: ['./sample-python-view.component.css']
})
export class SamplePythonViewComponent implements OnInit {
  helpUrl: any;
  moodInsightImage;
  concentrationInsightImage;
  stressInsightImage;

  constructor(private userProfileService: UserProfileService,
    private menuCtrl:MenuController,
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

  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {     
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length); 
     }
    });
    */
    this.moodInsightImage = "http://ec2-52-201-144-36.compute-1.amazonaws.com:56735/get_daily_plot?username=" + this.userProfileService.username + "&plot_type=edu.harvard.srl.MoodVisualization&cachebreaker=" + new Date().getTime();
    this.concentrationInsightImage = "http://ec2-52-201-144-36.compute-1.amazonaws.com:56735/get_daily_plot?username=" + this.userProfileService.username + "&plot_type=edu.harvard.srl.ConcentrationVisualization&cachebreaker=" + new Date().getTime();
    this.stressInsightImage = "http://ec2-52-201-144-36.compute-1.amazonaws.com:56735/get_daily_plot?username=" + this.userProfileService.username + "&plot_type=edu.harvard.srl.GoodDayVisualization&cachebreaker=" + new Date().getTime();

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
