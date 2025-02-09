import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatabaseService } from 'src/app/monitor/database.service';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
// import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private menuCtrl:MenuController,
    // private mobileAccessibility: MobileAccessibility,
    private uploadService: UploadserviceService) { }

  ngOnInit() {
    //this.mobileAccessibility.usePreferredTextZoom(false);
    this.menuCtrl.close();
  }

  ionViewDidEnter(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {
       this.db.addTrack(this.pageTitle, "Enter", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length);
     }
    });
    */
    this.uploadService.saveAppUsageEnter("study_contact_info_page");
  }

  ionViewDidLeave(){
    /*
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.addTrack(this.pageTitle, "Leave", this.userProfileService.username, Object.keys(this.userProfileService.userProfile.survey_data.daily_survey).length);
      }
    });
    */
    //this.mobileAccessibility.usePreferredTextZoom(true);
    this.uploadService.saveAppUsageExit("study_contact_info_page");
  }

}
