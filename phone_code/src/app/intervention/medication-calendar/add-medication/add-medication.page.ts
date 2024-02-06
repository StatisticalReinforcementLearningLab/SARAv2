import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  // Data passed in by componentProps
  @Input() data_string: any;
  
  constructor(private modalCtrl: ModalController) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.modalReady = true;
        // events[i].startTime = new Date(events[i].startTime);
        let data_obj = new Date(this.data_string);
        this.dateStr = moment(data_obj).format('MMM D, YYYY'); //new Date(this.dateStr);
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
    console.log("OnHold selected? = " + this.isMedicationOnHold);
    //this.modalController.dismiss(user);
    let medicationSelectData = {
      "date_string" : this.data_string,
      "medication_taken": this.medicationTaken,
      "is_medication_on_hold": this.isMedicationOnHold
    };
    this.modalCtrl.dismiss(medicationSelectData);
  }


}
