import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { OneSignalService } from './notification/one-signal.service';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private httpClient: HttpClient,
    private oneSignalService: OneSignalService,
    private ga: GoogleAnalytics
   ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.oneSignalService.initOneSignal();

      this.ga.startTrackerWithId(environment.googleAnalytic.id)
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.setUserId("Liying");
        //this.ga.debugMode();
      }).catch(e => alert('Error starting GoogleAnalytics == '+ e));

    });
    //window.localStorage.setItem("TotalPoints", "0");

  }

}
