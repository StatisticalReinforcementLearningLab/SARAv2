import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMedicationPageRoutingModule } from './add-medication-routing.module';

import { AddMedicationPage } from './add-medication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMedicationPageRoutingModule
  ],
  declarations: [AddMedicationPage]
})
export class AddMedicationPageModule {}
