import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';

@Component({
  selector: 'app-modal-unlocked-page',
  templateUrl: './modal-unlocked-page.component.html',
  styleUrls: ['./modal-unlocked-page.component.scss'],
})
export class ModalUnlockedPageComponent implements AfterViewInit {

  // Data passed in by componentProps
  @Input() reinforcements: any;
  whichImage;
  
  constructor(navParams: NavParams, public modalCtrl: ModalController, private userProfileService: UserProfileService) {
    // componentProps can also be accessed at construction time using NavParams
    console.log(navParams.get('firstName'));
    //this.reinforcements = [];//[{'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"}];
  }

  ngOnInit() {
    this.whichImage = './assets/altruism/altruism_1.png';
  }

  modalReady = false;
  ngAfterViewInit(): void {
    setTimeout(() => {
        this.modalReady = true;
    }, 1);
  }

 
  dismiss() {

    //pass-data: https://ionicframework.com/docs/v3/api/components/modal/ModalController/
    //let data = { 'foo': 'bar' };
    //this.modalCtrl.dismiss(data);
    this.modalCtrl.dismiss();

  }

}
