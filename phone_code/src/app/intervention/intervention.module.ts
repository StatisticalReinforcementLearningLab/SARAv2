import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HarvardArcAppsModule } from './harvard-arc-apps/harvard-arc-apps.module';
import { SleepMonitoringComponent } from './sleep-monitoring/sleep-monitoring.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MedicationCalendarComponent } from './medication-calendar/medication-calendar.component';
import { NgCalendarModule  } from 'ionic2-calendar';
import { AddEventModalPageModule } from './medication-calendar/add-event-modal/add-event-modal.module';


@NgModule({
  declarations: [SleepMonitoringComponent, MedicationCalendarComponent],
  imports: [
    CommonModule,
    HarvardArcAppsModule,
    NgCalendarModule,
    AddEventModalPageModule,
    IonicModule.forRoot() // have to add this for the backbutton to show.
  ],
  exports: [SleepMonitoringComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InterventionModule { }
