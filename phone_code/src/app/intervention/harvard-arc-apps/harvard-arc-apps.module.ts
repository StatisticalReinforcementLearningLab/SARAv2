import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontPageComponent } from './front-page/front-page.component';



@NgModule({
  declarations: [FrontPageComponent],
  imports: [
    CommonModule
  ],
  exports: [FrontPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HarvardArcAppsModule { }
