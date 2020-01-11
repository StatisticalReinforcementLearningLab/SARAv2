import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DemoAquariumComponent } from './demo-aquarium/demo-aquarium.component';
import { SurveyModule } from '../../survey/survey.module';
import { Routes, RouterModule } from '@angular/router';
import { DemoTundraComponent } from './demo-tundra/demo-tundra.component';

const routes: Routes = [
     { path: 'aquariumone', component: DemoAquariumComponent }
];

@NgModule({
  declarations: [DemoAquariumComponent,DemoTundraComponent],
  imports: [
    CommonModule,
    SurveyModule,
    IonicModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports:[
    DemoAquariumComponent,
    DemoTundraComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AquariumModule { }
