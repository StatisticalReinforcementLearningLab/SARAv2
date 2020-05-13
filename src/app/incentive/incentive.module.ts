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
import { TreasurechestComponent } from './treasurechest/treasurechest.component';
import { AwardAltruismComponent } from './award-altruism/award-altruism.component';
import { ModalUnlockedPageComponent } from './aquarium/modal-unlocked-page/modal-unlocked-page.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { StoreModule } from '@ngrx/store';
import {incentiveReducer} from './reducers';
import { UnlockedMemesComponent } from './unlocked-memes/unlocked-memes.component';
import { UnlockedAltuisticMessagesComponent } from './unlocked-altuistic-messages/unlocked-altuistic-messages.component';
import { FishbowlComponent } from './aquarium/previews/fishbowl/fishbowl.component';
import { SeaComponent } from './aquarium/previews/sea/sea.component';
import { TundraComponent } from './aquarium/previews/tundra/tundra.component';
import { RainforestComponent } from './aquarium/previews/rainforest/rainforest.component';

const routes: Routes = [
//  { path: 'award', component: AwardComponent },
  { path: 'award-memes', component: AwardMemesComponent },
//  { path: 'visualization', component: VisualizationComponent }
];

@NgModule({
  declarations: [AwardMemesComponent, AwardAltruismComponent, TreasurechestComponent, ModalUnlockedPageComponent,InfoPageComponent, UnlockedMemesComponent, UnlockedAltuisticMessagesComponent, FishbowlComponent, SeaComponent, TundraComponent, RainforestComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes),
    StoreModule.forFeature('incentive', incentiveReducer)
  ],
  exports:[
    //AwardComponent, 
    AwardMemesComponent, 
    AwardAltruismComponent
    //VisualizationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ModalUnlockedPageComponent]
})
export class IncentiveModule { }
