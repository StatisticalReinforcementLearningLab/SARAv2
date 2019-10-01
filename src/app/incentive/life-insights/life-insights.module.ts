import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Q1MotivatedComponent } from './q1-motivated/q1-motivated.component';
import { SampleLifeInsightsComponent } from './sample-life-insights/sample-life-insights.component';

@NgModule({
  declarations: [Q1MotivatedComponent,SampleLifeInsightsComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[Q1MotivatedComponent,SampleLifeInsightsComponent]
})
export class LifeInsightsModule { }
