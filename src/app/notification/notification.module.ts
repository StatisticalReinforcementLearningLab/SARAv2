import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneSignalService } from './one-signal.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ OneSignalService ]

})
export class NotificationModule { }
