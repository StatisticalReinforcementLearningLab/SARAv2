import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';
import { TreasurechestComponent } from '../incentive/treasurechest/treasurechest.component';
import { UnlockedMemesComponent } from '../incentive/unlocked-memes/unlocked-memes.component';
import { UnlockedAltuisticMessagesComponent } from '../incentive/unlocked-altuistic-messages/unlocked-altuistic-messages.component';
import { AuthGuard } from '../user/auth/auth.guard';
import { ContactComponent } from './contact/contact.component';
var routes = [
    {
        path: 'home',
        component: HomePage,
        children: [
            {
                path: 'incentive', component: AquariumComponent, canActivate: [AuthGuard]
            },
            {
                path: 'unlocables', component: TreasurechestComponent, canActivate: [AuthGuard]
            },
            {
                path: 'memes', component: UnlockedMemesComponent, canActivate: [AuthGuard]
            },
            {
                path: 'thankyous', component: UnlockedAltuisticMessagesComponent, canActivate: [AuthGuard]
            },
            {
                path: 'contact', component: ContactComponent, canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: '/home/incentive',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/home/incentive',
        pathMatch: 'full'
    }
];
var HomeRoutingModule = /** @class */ (function () {
    function HomeRoutingModule() {
    }
    HomeRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], HomeRoutingModule);
    return HomeRoutingModule;
}());
export { HomeRoutingModule };
//# sourceMappingURL=home-routing.module.js.map