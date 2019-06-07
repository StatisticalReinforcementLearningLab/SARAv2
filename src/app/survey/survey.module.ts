import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptedSurveyComponent } from './prompted-survey/prompted-survey.component';
import { MorningReportComponent } from './morning-report/morning-report.component';
import { InitiatedDrinkComponent } from './initiated-drink/initiated-drink.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageModule } from '../storage/storage.module';
import { ActivetaskComponent } from './activetask/activetask.component';

@NgModule({
  declarations: [InitiatedDrinkComponent,MorningReportComponent,PromptedSurveyComponent,ActivetaskComponent],
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
    ActivetaskComponent
  ]
})
export class SurveyModule { }
