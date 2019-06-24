import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';
import { VisualizationComponent } from './visualization/visualization.component';

@NgModule({
  declarations: [AwardComponent, AwardMemesComponent, VisualizationComponent],
  imports: [
    CommonModule
  ],
  exports:[AwardComponent, AwardMemesComponent, VisualizationComponent]
})
export class IncentiveModule { }
