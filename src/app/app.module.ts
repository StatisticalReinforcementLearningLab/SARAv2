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
import { NotificationModule } from './notification/notification.module';
import { IncentiveModule } from './incentive/incentive.module';
import { LifeInsightsModule } from './incentive/life-insights/life-insights.module';

import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SurveyModule } from './survey/survey.module';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { AquariumModule } from './incentive/aquarium/aquarium.module';
import { FormsModule } from '@angular/forms';
import { CheatpageComponent } from './incentive/aquarium/cheatpage/cheatpage.component';
import { UserModule } from './user/user.module';
import { HomePageModule } from './home/home.module';

@NgModule({
  declarations: [AppComponent,LoadingSpinnerComponent,CheatpageComponent],
  entryComponents: [CheatpageComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    SurveyModule,
    IncentiveModule,
    LifeInsightsModule,
    NotificationModule,
    HttpClientModule,
    AquariumModule,
    FormsModule,
    UserModule,
    HomePageModule,
    BlobModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    OneSignal,
    GoogleAnalytics,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  static injector: Injector;
  constructor(private injector: Injector) {
    AppModule.injector = injector;
  }
}
