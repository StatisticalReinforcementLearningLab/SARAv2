import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardComponent } from './award/award.component';
import { AwardMemesComponent } from './award-memes/award-memes.component';

@NgModule({
  declarations: [AwardComponent, AwardMemesComponent],
  imports: [
    CommonModule
  ],
  exports:[AwardComponent, AwardMemesComponent]
})
export class IncentiveModule { }
