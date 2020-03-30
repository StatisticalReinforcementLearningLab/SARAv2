import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BlobModule } from 'angular-azure-blob-service';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Injector } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NotificationModule } from './notification/notification.module';
import { IncentiveModule } from './incentive/incentive.module';
import { LifeInsightsModule } from './incentive/life-insights/life-insights.module';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { SurveyModule } from './survey/survey.module';
import { AquariumModule } from './incentive/aquarium/aquarium.module';
import { FormsModule } from '@angular/forms';
import { CheatpageComponent } from './incentive/aquarium/cheatpage/cheatpage.component';
import { UserModule } from './user/user.module';
import { HomePageModule } from './home/home.module';
import { AwardDollarService } from './incentive/award-money/award-dollar.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
var AppModule = /** @class */ (function () {
    function AppModule(injector) {
        this.injector = injector;
        AppModule_1.injector = injector;
    }
    AppModule_1 = AppModule;
    var AppModule_1;
    AppModule = AppModule_1 = tslib_1.__decorate([
        NgModule({
            declarations: [AppComponent, CheatpageComponent],
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
                OneSignal,
                AwardDollarService,
                GoogleAnalytics,
                AppVersion,
                { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
            ],
            bootstrap: [AppComponent]
        }),
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map