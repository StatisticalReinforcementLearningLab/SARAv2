import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InitiatedDrinkComponent } from './survey/initiated-drink/initiated-drink.component';
import { AwardComponent } from './incentive/award/award.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'survey/initated-drink', component: InitiatedDrinkComponent },
  { path: 'incentive/award', component: AwardComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
