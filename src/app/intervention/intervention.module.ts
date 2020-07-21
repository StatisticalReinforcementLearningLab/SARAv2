import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvardArcAppsModule } from './harvard-arc-apps/harvard-arc-apps.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HarvardArcAppsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InterventionModule { }
