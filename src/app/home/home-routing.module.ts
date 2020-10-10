import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';
//import { TreasurechestComponent } from '../incentive/treasurechest/treasurechest.component';
import { UnlockedMemesComponent } from '../incentive/unlocked-memes/unlocked-memes.component';
import { UnlockedAltuisticMessagesComponent } from '../incentive/unlocked-altuistic-messages/unlocked-altuistic-messages.component';
import { AuthGuard } from '../user/auth/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { UnlockedInspirationalQuotesComponent } from '../incentive/unlocked-inspirational-quotes/unlocked-inspirational-quotes.component';
//import { SampleLifeInsightsComponent } from '../incentive/life-insights/sample-life-insights/sample-life-insights.component';
import { ShowAllLifeInsightsComponent } from '../incentive/life-insights/show-all-life-insights/show-all-life-insights.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'incentive', component: AquariumComponent, canActivate: [AuthGuard]
      },
      {
        path: 'quotes', component: UnlockedInspirationalQuotesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'memes', component: UnlockedMemesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'thankyous', component: UnlockedAltuisticMessagesComponent, canActivate: [AuthGuard]
      },
      {
        path: 'lifeinsight', component: ShowAllLifeInsightsComponent, canActivate: [AuthGuard]
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}