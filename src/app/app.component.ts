import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { OneSignalService } from './notification/one-signal.service';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { environment } from '../environments/enivornment';



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
      //this.statusBar.styleDefault();

      // let status bar overlay webview
      //this.statusBar.overlaysWebView(true);
      // set status bar to white
      //this.statusBar.backgroundColorByHexString('#ffffff');

      if(this.platform.is('android')) {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString("#C0C0C0");
      }

      this.splashScreen.hide();
      this.oneSignalService.initOneSignal();

      this.ga.startTrackerWithId(environment.googleAnalytic.id)
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.setUserId("Liying");
        //this.ga.debugMode();
      }).catch(e => console.log('Error starting GoogleAnalytics == '+ e));

    });
    //window.localStorage.setItem("TotalPoints", "0");

    // let status bar overlay webview
    //this.statusBar.overlaysWebView(true);

    // set status bar to white
    //this.statusBar.backgroundColorByHexString('#ffffff');


  }

}
