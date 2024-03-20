import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { PromptedSurveyComponent } from './prompted-survey/prompted-survey.component';
//import { MorningReportComponent } from './morning-report/morning-report.component';
//import { InitiatedDrinkComponent } from './initiated-drink/initiated-drink.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageModule } from '../storage/storage.module';
//import { ActivetaskComponent } from './activetask/activetask.component';
//import { ActiveTask2Component } from './active-task2/active-task2.component';
import { DynamicSurveyComponent } from './dynamic-survey/dynamic-survey.component';
import { SampleSurveyComponent } from './sample-survey/sample-survey.component';
import { Routes, RouterModule } from '@angular/router';
import { IncentiveModule } from '../incentive/incentive.module';
import { AyaSampleSurveyComponent } from './aya-sample-survey/aya-sample-survey.component';
import { StoreModule } from '@ngrx/store';
import {surveyReducer} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import { SurveyEffects } from './survey.effects';
//import { HarvardSurveyComponent } from './harvard-survey/harvard-survey.component';
import { SleepSurveyComponent } from './sleep-survey/sleep-survey.component';
import { DogsSurveyComponent } from './dogs-survey/dogs-survey.component';
import { SleepStudyEveningSurveyComponent } from './sleep-study-evening-survey/sleep-study-evening-survey.component';
import { SleepSurveyWithPredictionComponent } from './sleep-survey-with-prediction/sleep-survey-with-prediction.component';
import { BaselineSurveyComponent } from './baseline-survey/baseline-survey.component';

const routes: Routes = [
    { path: 'samplesurvey', component: SampleSurveyComponent }
];

@NgModule({
  declarations: [
    DynamicSurveyComponent,
    AyaSampleSurveyComponent,
    SampleSurveyComponent,
    //HarvardSurveyComponent,
    SleepSurveyComponent,
    DogsSurveyComponent,
    SleepStudyEveningSurveyComponent,
    SleepSurveyWithPredictionComponent,
    BaselineSurveyComponent
  ],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    StorageModule,
    IncentiveModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('survey', surveyReducer),
    EffectsModule.forFeature([SurveyEffects])
  ],
  exports:[
    DynamicSurveyComponent,
    SampleSurveyComponent,
    AyaSampleSurveyComponent,
    //HarvardSurveyComponent,
    SleepSurveyComponent,
    DogsSurveyComponent,
    BaselineSurveyComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SurveyModule { }
