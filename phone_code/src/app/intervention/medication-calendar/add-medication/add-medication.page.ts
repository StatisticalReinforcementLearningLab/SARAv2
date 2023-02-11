import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-add-medication',
  templateUrl: './add-medication.page.html',
  styleUrls: ['./add-medication.page.scss'],
})
export class AddMedicationPage implements AfterViewInit {

  modalReady = false;
  dateStr = moment().format('MMM D, YYYY');
  constructor(private modalCtrl: ModalController) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.modalReady = true;
    }, 0);
  }

  ngOnInit() {
  }

}
