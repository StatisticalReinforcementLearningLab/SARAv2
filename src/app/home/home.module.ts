import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AquariumModule } from '../incentive/aquarium/aquarium.module';
import { HeaderComponent } from './header/header.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AquariumModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, HeaderComponent, TermsOfServiceComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports:[TermsOfServiceComponent]
})
export class HomePageModule {}
