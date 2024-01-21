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
  buttonString = "checkmark-circle-outline";
  medicationTaken = false;
  isMedicationOnHold = false;
  dateStr = moment().format('MMM D, YYYY');
  constructor(private modalCtrl: ModalController) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.modalReady = true;
    }, 0);
  }

  ngOnInit() {
  }

  changeMedicationTakenPressed(){
    
    if(this.buttonString == "checkmark-circle-outline"){
      console.log("medication not taken");
      this.buttonString = "checkmark-circle";
      this.medicationTaken = true;
    }else{
      console.log("medication taken");
      this.buttonString = "checkmark-circle-outline";
      this.medicationTaken = false;
    }

  }

  clickedMedHold() {
    console.log("Checkbox selected? = " + this.isMedicationOnHold);
  }

  closeModal(){
    console.log("Medication taken? = " + this.medicationTaken);
    console.log("Checkbox selected? = " + this.isMedicationOnHold);
    this.modalCtrl.dismiss();
  }


}
