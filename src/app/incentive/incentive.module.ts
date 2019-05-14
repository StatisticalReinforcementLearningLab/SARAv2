import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwardComponent } from './award/award.component';

@NgModule({
  declarations: [AwardComponent],
  imports: [
    CommonModule
  ],
  exports:[AwardComponent]
})
export class IncentiveModule { }
