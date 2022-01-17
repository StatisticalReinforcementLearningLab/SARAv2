import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvardArcAppsModule } from './harvard-arc-apps/harvard-arc-apps.module';
import { SleepMonitoringComponent } from './sleep-monitoring/sleep-monitoring.component';



@NgModule({
  declarations: [SleepMonitoringComponent],
  imports: [
    CommonModule,
    HarvardArcAppsModule,
  ],
  exports: [SleepMonitoringComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InterventionModule { }
