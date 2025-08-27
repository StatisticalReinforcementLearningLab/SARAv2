import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { FormsModule } from '@angular/forms';
// import { IonDatetime } from '@ionic/angular/standalone';

@Component({
    selector: 'app-medication-time-picker',
    templateUrl: './medication-time-picker.component.html',
    styleUrls: ['./medication-time-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [FormsModule],
})
export class MedicationTimePickerComponent implements OnInit {
    selectedTime2: String;
    availableHours: number[] = [0, 1, 2, 3, 4];
    public myDate!: String;
    myInitialValue; String;
    medTime: String;
    medTimeStr: String;
    selecteTimeString: String;
    medTimeStrChanged: String;
    changedHour: String;
    @ViewChild('medDateTime') dateTime: ElementRef;

    //ToDo:
    // Save to sever correctly. Read from server correctly.
    // Set the time correctly once changed or pressed save.
    // Get the current time correctly.

    constructor(private menuCtrl: MenuController,
        private router: Router,
        private userProfileService: UserProfileService) {
        
    }

    goHome() {
        this.router.navigate(['home']);
    }
    ngOnInit() {}

    ionViewDidEnter(){
        this.menuCtrl.close();

        let theTime= new Date();
        //tomorrow.setDate(tomorrow.getDate() + 1);
        theTime.setHours(6);
        theTime.setMinutes(0);
        //this.myInitialValue = "2025-08-08T03:00:00.000Z"; //theTime.toISOString(); 
        //console.log('Selected date/time:', this.myDate + ", " + theTime);
        
        // console.log('medicationTime', this.userProfileService.userProfile.medicationTime);
        // console.log(this.userProfileService.userProfile.medicationTime === undefined);
        //console.log(typeof this.userProfileService.userProfile['medicationTime']);

        // if(!(this.userProfileService.userProfile.hasOwnProperty("medicationTime")) ||
        //     (typeof this.userProfileService.userProfile['medicationTime'] === 'undefined'))
        if(this.userProfileService.userProfile.medicationTime === undefined)
        {
            this.userProfileService.userProfile.medicationTime = "20";
            //
            this.userProfileService.saveProfileToDevice();
            //this.userProfileService.saveToServer();

        }

        let getYYYYMMDD = new Date().toISOString().substring(0, 10);
        let prefix = getYYYYMMDD + "T";
        let suffix = ":00:00.000Z";
        let selectedTimeStrISO = prefix + this.userProfileService.userProfile.medicationTime + ":00:00.000Z";
        this.medTime = selectedTimeStrISO; //this will set the picker to medicationTime time. It uses GMT

        // var selectedTime = new Date();
        const selectedTime = new Date(); // current local time
        selectedTime.setHours(parseInt(this.userProfileService.userProfile.medicationTime));
        selectedTime.setMinutes(0);
        selectedTime.setSeconds(0);
        selectedTime.setMilliseconds(0);

        // const offsetMinutes = date.getTimezoneOffset();
        // console.log("Timezone offset in minutes:", offsetMinutes);

        let hour = selectedTime.getHours();
        if(hour >= 12){ //PM
            //this.availableHours = [6, 7, 8, 9, 10, 11];
            if(hour == 12)
                this.medTimeStr = "12:00 pm";
            else
                this.medTimeStr = "" + (hour-12) + ":00 pm";
        }else{ //AM
            //this.availableHours = [0, 1, 2, 3, 4];
            if(hour == 0)
                this.medTimeStr = "12:00 am";
            else
                this.medTimeStr = "" + (hour) + ":00 am";
        }
        this.medTimeStrChanged = this.medTimeStr;
        this.medTime = prefix + this.userProfileService.userProfile.medicationTime + ":00:00.000Z";
        console.log('hour:', hour);
        console.log('this.medTime:', this.medTime);
        this.changedHour = this.userProfileService.userProfile.medicationTime;
        // console.log('this.medTime2:', typeof this.medTime);
        
        setTimeout(_ => {
            //this.dateTime.getValue(new Date().toISOString());
            //console.log('medTime:', this.dateTime.initialValue);
            console.log("myDate", this.myDate, this.dateTime.nativeElement.value);
        });

    }

    onDateChange(event: CustomEvent) {
        //let x = typeof event.detail.value;
        console.log('Selected date/time:', event.detail.value);
        console.log('myDate:', this.myDate, this.dateTime.nativeElement.value);

        var selectedTime = new Date(event.detail.value);
        let hour = selectedTime.getHours();

        if(hour >= 12){ //PM
            //this.availableHours = [6, 7, 8, 9, 10, 11];
            if(hour == 12)
                this.medTimeStrChanged = "12:00 pm";
            else
                this.medTimeStrChanged = "" + (hour-12) + ":00 pm";
        }else{ //AM
            //this.availableHours = [0, 1, 2, 3, 4];
            if(hour == 0)
                this.medTimeStrChanged = "12:00 am";
            else
                this.medTimeStrChanged = "" + (hour) + ":00 am";
        }
        this.changedHour = "" + hour;
        console.log("this.medTimeStrChanged: " + this.medTimeStrChanged);
        // Perform further actions with the new date/time
    }

    mySaveFunction(){
        this.medTime = this.medTimeStrChanged;
        this.userProfileService.userProfile.medicationTime = this.changedHour;
        //
        this.userProfileService.saveProfileToDevice();
        this.userProfileService.saveToServer();
        this.goHome();
    }

}
