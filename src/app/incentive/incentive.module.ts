import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
//import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
//import { VisualizationComponent } from './visualization/visualization.component';
//import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';
//import { SurveyModule } from '../survey/survey.module';
import { Routes, RouterModule } from '@angular/router';
import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';
import { AwardComponent } from './award/award.component';
import { TreasurechestComponent } from './treasurechest/treasurechest.component';
import { AwardAltruismComponent } from './award-altruism/award-altruism.component';

const routes: Routes = [
//  { path: 'award', component: AwardComponent },
  { path: 'award-memes', component: AwardMemesComponent },
//  { path: 'visualization', component: VisualizationComponent }
];

@NgModule({
  declarations: [AwardComponent, AwardMemesComponent, AwardAltruismComponent, TreasurechestComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports:[
    //AwardComponent, 
    AwardMemesComponent, 
    AwardAltruismComponent
    //VisualizationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncentiveModule { }
