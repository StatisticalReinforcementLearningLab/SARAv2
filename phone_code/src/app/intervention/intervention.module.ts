import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvardArcAppsModule } from './harvard-arc-apps/harvard-arc-apps.module';
import { SleepMonitoringComponent } from './sleep-monitoring/sleep-monitoring.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [SleepMonitoringComponent],
  imports: [
    CommonModule,
    HarvardArcAppsModule,
    IonicModule.forRoot() // have to add this for the backbutton to show.
  ],
  exports: [SleepMonitoringComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InterventionModule { }
