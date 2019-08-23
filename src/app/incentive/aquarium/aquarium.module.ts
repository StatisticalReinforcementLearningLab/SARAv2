import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DynamicSurveyComponent } from 'src/app/survey/dynamic-survey/dynamic-survey.component';

@NgModule({
  declarations: [DynamicSurveyComponent],
  imports: [
    CommonModule,
    IonicModule.forRoot()
  ],
  exports:[
    DynamicSurveyComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AquariumModule { }
