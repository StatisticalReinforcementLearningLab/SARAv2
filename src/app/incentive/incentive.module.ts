import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { DemoAquariumComponent } from './aquarium/demo-aquarium/demo-aquarium.component';

@NgModule({
  declarations: [AwardComponent, AwardMemesComponent, VisualizationComponent, DemoAquariumComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports:[AwardComponent, AwardMemesComponent, VisualizationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncentiveModule { }
