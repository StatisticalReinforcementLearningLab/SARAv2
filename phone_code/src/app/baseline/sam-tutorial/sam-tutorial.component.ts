import { AfterContentChecked, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import SwiperCore, { Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller, 
} from 'swiper';
import { SwiperComponent } from 'swiper/angular';
// import { IonicSwiper } from '@ionic/angular';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
]);

@Component({
  selector: 'app-sam-tutorial',
  templateUrl: './sam-tutorial.component.html',
  styleUrls: ['./sam-tutorial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SamTutorialComponent implements AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  slidesEx = ['first', 'second'];

  constructor() { }
  ngAfterContentChecked(): void {
    if(this.swiper){
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {}

  onSwiper([swiper]) {
    console.log(swiper);
  }

  onSlideChange() {
    console.log('slide change');
  }
}
