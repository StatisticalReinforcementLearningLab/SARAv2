import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BlobModule } from 'angular-azure-blob-service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { File } from '@ionic-native/file/ngx';
import { Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//import { SurveyModule } from './survey/survey.module';
import { NotificationModule } from './notification/notification.module';
//import { IncentiveModule } from './incentive/incentive.module';
//import { LifeInsightsModule } from './incentive/life-insights/life-insights.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    //IncentiveModule,
    //LifeInsightsModule,
    NotificationModule,
    HttpClientModule,
    BlobModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  static injector: Injector;
  constructor(private injector: Injector) {
    AppModule.injector = injector;
  }
}
