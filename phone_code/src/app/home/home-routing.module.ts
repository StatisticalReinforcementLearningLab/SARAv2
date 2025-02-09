import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';
import { TreasurechestComponent } from '../incentive/treasurechest/treasurechest.component';
import { UnlockedMemesComponent } from '../incentive/unlocked-memes/unlocked-memes.component';
import { UnlockedAltuisticMessagesComponent } from '../incentive/unlocked-altuistic-messages/unlocked-altuistic-messages.component';
import { AuthGuard } from '../user/auth/auth.guard';
import { ContactComponent } from './contact/contact.component';
import { UnlockedInspirationalQuotesComponent } from '../incentive/unlocked-inspirational-quotes/unlocked-inspirational-quotes.component';
import { SleepMonitoringComponent } from '../intervention/sleep-monitoring/sleep-monitoring.component';
import { VegaVisComponent } from '../incentive/life-insights/vega-vis/vega-vis.component';
import { MedicationCalendarComponent } from '../intervention/medication-calendar/medication-calendar.component';
import { UnlockedRewardsComponent } from '../incentive/unlocked-rewards/unlocked-rewards.component';

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
        path: 'rewards', component: UnlockedRewardsComponent, canActivate: [AuthGuard]
      },
      {
        path: 'contact', component: ContactComponent, canActivate: [AuthGuard]
      },
      {
        path: 'insights', component: VegaVisComponent, canActivate: [AuthGuard]
        //path: 'sleep', component: SleepMonitoringComponent, canActivate: [AuthGuard]
      },
      {
        path: 'med_calendar', component: MedicationCalendarComponent, canActivate: [AuthGuard]
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