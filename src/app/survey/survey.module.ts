import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptedSurveyComponent } from './prompted-survey/prompted-survey.component';
import { MorningReportComponent } from './morning-report/morning-report.component';
import { InitiatedDrinkComponent } from './initiated-drink/initiated-drink.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageModule } from '../storage/storage.module';
import { ActivetaskComponent } from './activetask/activetask.component';
import { ActiveTask2Component } from './active-task2/active-task2.component';
import { DynamicSurveyComponent } from './dynamic-survey/dynamic-survey.component';

@NgModule({
  declarations: [InitiatedDrinkComponent,MorningReportComponent,PromptedSurveyComponent,ActivetaskComponent,DynamicSurveyComponent,ActiveTask2Component],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    StorageModule
  ],
  exports:[
    InitiatedDrinkComponent,
    MorningReportComponent,
    PromptedSurveyComponent,
    ActivetaskComponent,
    ActiveTask2Component,
    DynamicSurveyComponent
  ]
})
export class SurveyModule { }
