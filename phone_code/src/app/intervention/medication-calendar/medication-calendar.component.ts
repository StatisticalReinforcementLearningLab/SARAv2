import { CalendarComponent } from 'ionic2-calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AddEventModalPage } from './add-event-modal/add-event-modal.page';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
import { AddMedicationPage } from './add-medication/add-medication.page';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import moment from 'moment';
// import { CalModalPage } from '../pages/cal-modal/cal-modal.page';

@Component({
    selector: 'app-medication-calendar',
    templateUrl: './medication-calendar.component.html',
    styleUrls: ['./medication-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MedicationCalendarComponent implements OnInit {

    eventSource = [];
    viewTitle: string;

    type = 'calendar';

    segmentChanged(ev: any) {
        console.log('Segment changed', ev.detail["value"]);
        this.type = ev.detail["value"];
    }

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    @ViewChild(CalendarComponent, null) myCal: CalendarComponent;

    constructor(private modalCtrl: ModalController,
        private userProfileService: UserProfileService) { 

    }

    ngOnInit() { }

    ngAfterViewInit(): void {
        // console.log("myCal " + this.myCal);
        // setTimeout(function() {
        //     console.log("inside time out function");
        //     //console.log("myCal " + this.myCal);
        //     if (window.localStorage.getItem("eventSource") === null) {
        //         console.log("no events found");
        //         this.createRandomEvents();
        //     }else{
        //         console.log("events found");
        //         let events = JSON.parse(window.localStorage.getItem('eventSource'));
        //         // console.log(JSON.stringify(events));
        //         this.eventSource = events;
        //         this.myCal.loadEvents();
        //     }
        // },1000);

        setTimeout(() => {
            // console.log("inside time out function");
            // console.log("myCal " + this.myCal);

            // How to handle initial case:
            // If the medicationEvents is not in the user profile, 
            // If the medicationEvent is empty 
            if (window.localStorage.getItem("eventSource") === null) {
                console.log("no events found");
                this.createRandomEvents();
            }else{
                console.log("events found");
                let events = JSON.parse(window.localStorage.getItem('eventSource'));
                var countData = events.length;
                for (var i = 0; i < countData; i++) {
                    events[i].startTime = new Date(events[i].startTime);
                    events[i].endTime = new Date(events[i].endTime);
                    events[i].medicationIntakeTime = new Date(events[i].medicationIntakeTime);
                }
                this.eventSource = events;
            }
        }, 100);
        console.log(JSON.stringify(this.userProfileService.userProfile));
    }

    // Change current month/week/day
    next() {
        // console.log("myCal " + this.myCal);
        this.myCal.slideNext();
    }

    back() {
        this.myCal.slidePrev();
    }

    // Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }


    diffInDaysFromCurrentDay(date1, date2) {

        let diffTime = Math.abs(date2 - date1);
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // console.log(date2);
        // console.log(date1);
        // console.log(diffDays + " days");

        return diffDays;
    }


    createRandomEvents() {
        /*
            Creates a random list of events.
            Pulled from the ionic2-calendar repository.
            See how the events are added.

            Example of data is below.
            The startTime and endTime are Date object from Javascript.

            [
                {
                    "title": "Event - 0",
                    "startTime": "2022-10-28T06:20:00.000Z",
                    "endTime": "2022-10-28T08:59:00.000Z",
                    "allDay": false
                }, {
                    "title": "All Day - 1",
                    "startTime": "2022-09-24T00:00:00.000Z",
                    "endTime": "2022-09-25T00:00:00.000Z",
                    "allDay": true
                }
            ]
            
            Note: I can probably add more to the event. See the documentation.

        */
        var events = [];
        for (var i = 0; i < 50; i += 1) {
            var date = new Date();
            var eventType = Math.floor(Math.random() * 2); //0=no survey, 1 survey.
            // 
            var startTime = new Date(new Date().setHours(-1 * 24 * i, 1, 0, 0));
            var endTime = new Date(new Date().setHours(-1 * 24 * i + 1, 1, 0, 0));

            if (i > 0) {
                if (eventType == 1) {
                    // Survey is completed

                    events.push({
                        title: 'Day -' + i,
                        startTime: startTime,
                        endTime: endTime,
                        medicationIntakeTime: startTime,
                        allDay: false,
                        descritpion: "6mp taken",
                        symbolType: "checkmark"
                    });
                } else {
                    // survey is not completed.
                    let currentDayMidnightUTC = new Date(new Date().setHours(0, 1, 0, 0));

                    if (this.diffInDaysFromCurrentDay(startTime, currentDayMidnightUTC) > 2) {
                        events.push({
                            title: 'Day -' + i,
                            startTime: startTime,
                            endTime: endTime,
                            medicationIntakeTime: startTime,
                            allDay: false,
                            descritpion: "6mp not taken",
                            symbolType: "cross"
                        });
                    } else {
                        //Within 3 days, so we still give people
                        //chance to complete the survey.
                        events.push({
                            title: 'Day -' + i,
                            startTime: startTime,
                            endTime: endTime,
                            medicationIntakeTime: startTime,
                            allDay: false,
                            descritpion: "6mp add",
                            symbolType: "add"
                        });
                    }
                }
            } else {
                // we will always make the current day as add one.
                events.push({
                    title: 'Day -' + i,
                    startTime: startTime,
                    endTime: endTime,
                    medicationIntakeTime: startTime,
                    allDay: false,
                    descritpion: "6mp add",
                    symbolType: "add"
                });
            }
        }
        this.eventSource = events;
        // console.log(JSON.stringify(events));
        //window.localStorage.setItem('eventSource', JSON.stringify(events));
        this.saveMedicationEvents(events);
    }

    saveMedicationEvents(events) {

        window.localStorage.setItem('eventSource', JSON.stringify(events));
        this.userProfileService.medicationEvents(events);
        // this.userProfileService.userProfile.medicationEvents = events;
        // console.log(JSON.stringify(this.userProfileService.userProfile));
        // this.userProfileService.saveToServer();
        // this.userProfileService.saveProfileToDevice();

    }

    removeEvents() {
        this.eventSource = [];
    }

    addMedication(dateStr) {
        console.log(dateStr);
        //this.openAddEventModal();
        this.openAddMedicationModal(dateStr);
    }


    // async openAddEventModal() {
    //     /*
    //         Pops up a modal view to manually add events.
    //         Events in our case is an event of taking medication.
    //     */


    //     const modal = await this.modalCtrl.create({
    //         component: AddEventModalPage,
    //         /* 
    //            We added a css class in global.scss
    //            Note modals lives on top of the application, so
    //            We have to uset the global css. 
    //         */
    //         cssClass: 'add-event-modal',
    //         backdropDismiss: false
    //     });

    //     await modal.present();

    //     modal.onDidDismiss().then((result) => {
    //         if (result.data && result.data.event) {
    //             let event = result.data.event;
    //             if (event.allDay) {
    //                 let start = event.startTime;
    //                 event.startTime = new Date(
    //                     Date.UTC(
    //                         start.getUTCFullYear(),
    //                         start.getUTCMonth(),
    //                         start.getUTCDate()
    //                     )
    //                 );
    //                 event.endTime = new Date(
    //                     Date.UTC(
    //                         start.getUTCFullYear(),
    //                         start.getUTCMonth(),
    //                         start.getUTCDate() + 1
    //                     )
    //                 );
    //             }
    //             this.eventSource.push(result.data.event);
    //             this.myCal.loadEvents();
    //         }
    //     });
    // }

    async openAddMedicationModal(dateStr) {
        /*
            Pops up a modal view to manually add events.
            Events in our case is an event of taking medication.
        */


        const modal = await this.modalCtrl.create({
            component: AddMedicationPage,
            componentProps: {
                'data_string': dateStr
            },
            /* 
               We added a css class in global.scss
               Note modals lives on top of the application, so
               We have to uset the global css. 
            */
            cssClass: 'add-medication',
            backdropDismiss: false
        });

        //console.log(dateStr);

        modal.onDidDismiss()
            .then((data) => {
                const medicationSelectData = data['data']; // Here's your selected user!
                console.log(JSON.stringify(medicationSelectData));
                this.updateMedicationCalendarEvent(medicationSelectData);
        });

        await modal.present();
    }

    updateMedicationCalendarEvent(medicationSelectData: any) {
        //
        let date_string = medicationSelectData["date_string"];
        let medicationTaken = medicationSelectData["medication_taken"];
        let isMedicationOnHold = medicationSelectData["is_medication_on_hold"];
        
        console.log("medicationTaken " + medicationTaken);
        if(medicationTaken == true){
            var dStart;
            let date_obj = new Date(date_string);
            for(var i = 49; i >= 0 ; i -= 1) {
                dStart = this.eventSource[i].startTime;
                if (date_obj.getTime() === dStart.getTime()){
                    this.eventSource[i].symbolType = "checkmark";
                    this.eventSource[i].descritpion = "6mp taken";
                    break;
                }
            }
            this.myCal.loadEvents();
            this.saveMedicationEvents(this.eventSource);
        } 
    }


    parseEcapBottleData() {
        const jsonString = '{ "success": true, "command_code": 1, "tag_message": { "tag_id": "100123959-BR1", "scan_time": 1689952593, "event_count": 3, "package_id": "", "patient_id": "", "custom_data_1": "", "versioning": { "model": "eCap Argus-Loc", "firmware_version": "1.1.1.0.1.4.0", "hardware_version": "1.0.0" }, "started": true, "clock_coefficient_correction": true, "tag_events": [ { "timestamp": 1689345543 }, { "timestamp": 1689345603 }, { "timestamp": 1689345663 } ] } }';
        const obj = JSON.parse(jsonString);
        console.log(obj);
    }

    printEvents(events){
        console.log(JSON.stringify(events));
        if((events.length == 1) && ("title" in events[0])){
            var date_clicked = events[0];
            let date_str = moment(date_clicked["startTime"]).format('MM/DD/YYYY'); 
            if (date_clicked["symbolType"] == "checkmark"){
                let time_taken = moment(date_clicked["medicationIntakeTime"]).format('hh:mm A'); 
                return date_str + " - 6MP taken at " + time_taken;
            }else if(date_clicked["symbolType"] == "add"){
                return date_str + " - Record unavailable ";
            }else{
                return date_str + " - 6MP likely not taken";;
            }
        } else {
            return "";
        }
    }


}
