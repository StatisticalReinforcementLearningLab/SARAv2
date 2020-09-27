import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BlobModule } from 'angular-azure-blob-service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Injector } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotificationModule } from './notification/notification.module';
import { IncentiveModule } from './incentive/incentive.module';
import { LifeInsightsModule } from './incentive/life-insights/life-insights.module';
import { SurveyModule } from './survey/survey.module';
import { AquariumModule } from './incentive/aquarium/aquarium.module';
import { FormsModule } from '@angular/forms';
import { CheatpageComponent } from './incentive/aquarium/cheatpage/cheatpage.component';
import { UserModule } from './user/user.module';
import { HomePageModule } from './home/home.module';
import { AwardDollarService } from './incentive/award-money/award-dollar.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import { GlobalErrorHandler } from './error_handler/GlobalErrorHandler';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { InterventionModule } from './intervention/intervention.module';


@NgModule({
  declarations: [AppComponent,CheatpageComponent],
  entryComponents: [CheatpageComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    SurveyModule,
    IncentiveModule,
    NotificationModule,
    HttpClientModule,
    AquariumModule,
    FormsModule,
    UserModule,
    HomePageModule,
    InterventionModule,
    BlobModule.forRoot(),
    //this ngrx import
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    //dev tool maxAge 25 versions of the data
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([])
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    AwardDollarService,
    AppVersion,
    MobileAccessibility,
    SQLite,
    SQLitePorter,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    //,
    //{provide: ErrorHandler, useClass: GlobalErrorHandler}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  static injector: Injector;
  constructor(private injector: Injector) {
    AppModule.injector = injector;
  }
}
