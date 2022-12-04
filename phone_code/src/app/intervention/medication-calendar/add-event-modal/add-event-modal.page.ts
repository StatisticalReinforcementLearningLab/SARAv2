import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-add-event-modal',
    templateUrl: './add-event-modal.page.html',
    styleUrls: ['./add-event-modal.page.scss'],
})
export class AddEventModalPage implements AfterViewInit {

    calendar = {
        mode: 'month',
        currentDate: new Date()
    };
    viewTitle: string;

    event = {
        title: '',
        desc: '',
        startTime: null,
        endTime: '',
        allDay: true
    };

    modalReady = false;

    constructor(private modalCtrl: ModalController) { }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.modalReady = true;
        }, 0);
    }

    ngOnInit() {
    }

    save() {
        /*
        If "right" is pressed, we return nothing. 
        "dismiss" function willc all the onDidDismiss function of the
        medication-calendar.component.ts file.  
        */
        this.modalCtrl.dismiss({ event: this.event })
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onTimeSelected(ev) {
        this.event.startTime = new Date(ev.selectedTime);
    }

    close() {
        /*
        If cross is pressed, we return nothing. 
        "dismiss" function willc all the onDidDismiss function of the
        medication-calendar.component.ts file.  
        */
        this.modalCtrl.dismiss();
    }

    markDisabled = (date: Date) => {
        var current = new Date();
        current.setHours(0,0,0,0); // set to last midnight

        // Left limit is three days ago.
        var threeDaysAgo = new Date();
        threeDaysAgo.setDate(current.getDate() - 3);

        // Right limit is today end of 12 PM.
        var tomorrowMidnight = new Date();
        tomorrowMidnight.setHours(24,0,0,0);

        //console.log(d.toString());
        return (date < threeDaysAgo) || (date > tomorrowMidnight) ;
    };

}
