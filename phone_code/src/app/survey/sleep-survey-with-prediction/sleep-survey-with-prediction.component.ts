import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';

@Component({
  selector: 'app-sleep-survey-with-prediction',
  templateUrl: './sleep-survey-with-prediction.component.html',
  styleUrls: ['./sleep-survey-with-prediction.component.css']
})
export class SleepSurveyWithPredictionComponent implements OnInit {

  whichImage;
  showScreenUsage;

  constructor(private userProfileService: UserProfileService,
    // private mobileAccessibility: MobileAccessibility,
    private uploadService: UploadserviceService) { }

    ngOnInit() {
      // this.mobileAccessibility.usePreferredTextZoom(false);
      this.showScreenUsage = true;
    }

    ionViewDidEnter(){

     // this.whichImage = "http://ec2-52-201-144-36.compute-1.amazonaws.com:56734/get_daily_plot?username=" + this.userProfileService.username + "&cachebreaker=" + new Date().getTime();
     //this.whichImage = "http://ec2-52-201-144-36.compute-1.amazonaws.com:56735/get_daily_plot?username=" + this.userProfileService.username + "&plot_type=edu.harvard.srl.SleepAppUsageVisualization&cachebreaker=" + new Date().getTime();
     this.whichImage = "http://0.0.0.0:5001/get_daily_plot"
     this.uploadService.saveAppUsageEnter("sleep_survey_page_with_prediction");

   }

   reloadPage() {
        window.location.reload();
   }

   ionViewDidLeave(){
      // this.mobileAccessibility.usePreferredTextZoom(true);
      this.uploadService.saveAppUsageExit("sleep_survey_page_with_prediction");
   }

}
