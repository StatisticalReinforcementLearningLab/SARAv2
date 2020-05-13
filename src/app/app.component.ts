import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignalService } from './notification/one-signal.service';

import { environment } from '../environments/environment';
import { Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationStart, NavigationEnd } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { UserProfileService } from './user/user-profile/user-profile.service';
import { AuthService } from './user/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public isShowingRouteLoadIndicator: boolean;
  loading;
  // isLoading = true;

  constructor(
    private router: Router, 
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignalService: OneSignalService,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    public loadingController: LoadingController
   ) {
    this.initializeApp();

    router.events.subscribe(
			( event: RouterEvent ) : void => {

        //this.isShowingRouteLoadIndicator = false;
        var asyncLoadCount = 0;

        
				if ( event instanceof RouteConfigLoadStart ) {
          asyncLoadCount++;
          console.log("Routing started");
          //console.log(event);
          //this.survey_text = "Loading Survey";
          console.log(event.route.path);

          // if(event.route.path == "survey")
          //    this.showLaoding();

				} else if ( event instanceof RouteConfigLoadEnd ) {
          asyncLoadCount--;
          console.log("Routing ended");
          console.log(event.route.path);

          // if(event.route.path == "survey")
          //    this.dismissLoading();

          //console.log(event);
          //this.survey_text = "Start survey";
          //console.log(this.router.url);
				} else if ( event instanceof NavigationStart ) {
          console.log("Navigation started");
          //this.survey_text = "Start survey";
				} else if ( event instanceof NavigationEnd ) {
          asyncLoadCount--;
          console.log("Navigation ended");
          //this.survey_text = "Start survey";
				}

				// If there is at least one pending asynchronous config load request,
				// then let's show the loading indicator.
				// --
				// CAUTION: I'm using CSS to include a small delay such that this loading
				// indicator won't be seen by people with sufficiently fast connections.
				this.isShowingRouteLoadIndicator = !! asyncLoadCount;

			}
		);
  }

  agreeToTerms: boolean = JSON.parse(localStorage.getItem("agreeToTerms"));
  private userSub: Subscription;

  ngOnInit(){
  }

  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  initializeApp() {

    if(this.authService.isLoggedIn()){
      this.userProfileService.loadProfileFromDevice();
      // this.isLoading = false;

      // get up to date userProfileFixed - to see if isActive has changed
      this.userProfileService.fetchUserProfileFixed().subscribe(response=>{
        if(response.changed){
          // there was a change to isActive
          // accessible via
          // this.userProfileService.isActive
        }
      });

      // fetch a copy from server of userProfile to see if it's newer 
      this.userProfileService.fetchUserProfile().subscribe(response=>{
        if(response.serverCopyNewer){
          // the server copy of the userProfile was newer (and has been updated locally)
          // accessible via
          // this.userProfileService.userProfile
        }
      });


    }

    else {
      // not logged in; so do nothing
      // should be routed via the authguard to the login screen
      // after login occurs we should load the UP and UPF - which happens via the auth.component
    }

    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();

      // let status bar overlay webview
      //this.statusBar.overlaysWebView(true);
      // set status bar to white
      //this.statusBar.backgroundColorByHexString('#ffffff');

      if(this.platform.is('android')) {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString("#004166");
      }

      this.splashScreen.hide();
      this.oneSignalService.initOneSignal();

    });
    //window.localStorage.setItem("TotalPoints", "0");

    // let status bar overlay webview
    //this.statusBar.overlaysWebView(true);

    // set status bar to white
    //this.statusBar.backgroundColorByHexString('#ffffff');


  }

  async showLoading(){
    this.loading = await this.loadingController.create({
      message: "Loading...",
      spinner: "lines",
      duration: 5000
    });

    this.loading.onDidDismiss(() => {
      console.log('Dismissed loading after 5 seconds');
    });

    this.loading.present();
  }

  async dismissLoading(){
    this.loading.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Hellooo',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

}
