import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptedSurveyComponent } from './prompted-survey/prompted-survey.component';
import { MorningReportComponent } from './morning-report/morning-report.component';
import { InitiatedDrinkComponent } from './initiated-drink/initiated-drink.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    InitiatedDrinkComponent,
    MorningReportComponent,
    PromptedSurveyComponent
  ]
})
export class SurveyModule { }
