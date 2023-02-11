import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMedicationPage } from './add-medication.page';

const routes: Routes = [
  {
    path: '',
    component: AddMedicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMedicationPageRoutingModule {}
