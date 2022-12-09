import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamTutorialComponent } from './sam-tutorial/sam-tutorial.component';
import { SwiperModule } from 'swiper/angular';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [SamTutorialComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule
  ]
})
export class BaselineModule { }
