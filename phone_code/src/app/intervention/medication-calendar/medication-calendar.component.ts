import { CalendarComponent } from 'ionic2-calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AddEventModalPage } from './add-event-modal/add-event-modal.page';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
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

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() { }

    // Change current month/week/day
    next() {
        this.myCal.slideNext();
    }

    back() {
        this.myCal.slidePrev();
    }

    // Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }


    diffInDaysFromCurrentDay(date1, date2){

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
            var startTime = new Date(new Date().setHours(-1*24*i,1,0,0));
            var endTime = new Date(new Date().setHours(-1*24*i + 1,1,0,0));

            if(i > 0) {
                if(eventType == 1) {
                    // Survey is completed
                    
                    events.push({
                        title: 'Day -' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false,
                        descritpion: "6mp taken",
                        symbolType: "checkmark"
                    });
                } else {
                    // survey is not completed.
                    let currentDayMidnightUTC = new Date(new Date().setHours(0,1,0,0));

                    if(this.diffInDaysFromCurrentDay(startTime, currentDayMidnightUTC) > 2) {
                        events.push({
                            title: 'Day -' + i,
                            startTime: startTime,
                            endTime: endTime,
                            allDay: false,
                            descritpion: "6mp not taken",
                            symbolType: "cross"
                        });
                    }else{
                        //Within 3 days, so we still give people
                        //chance to complete the survey.
                        events.push({
                            title: 'Day -' + i,
                            startTime: startTime,
                            endTime: endTime,
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
                    allDay: false,
                    descritpion: "6mp add",
                    symbolType: "add"
                });
            }
        }
        this.eventSource = events;
        console.log(JSON.stringify(events))
    }
    

    removeEvents() {
        this.eventSource = [];
    }

    addMedication(dateStr) {
        console.log(dateStr);
    }


    async openAddEventModal() {
        /*
            Pops up a modal view to manually add events.
            Events in our case is an event of taking medication.
        */

        
        const modal = await this.modalCtrl.create({
            component: AddEventModalPage,
            /* 
               We added a css class in global.scss
               Note modals lives on top of the application, so
               We have to uset the global css. 
            */
            cssClass: 'add-event-modal', 
            backdropDismiss: false
        });

        await modal.present();

        modal.onDidDismiss().then((result) => {
            if (result.data && result.data.event) {
                let event = result.data.event;
                if (event.allDay) {
                    let start = event.startTime;
                    event.startTime = new Date(
                        Date.UTC(
                            start.getUTCFullYear(),
                            start.getUTCMonth(),
                            start.getUTCDate()
                        )
                    );
                    event.endTime = new Date(
                        Date.UTC(
                            start.getUTCFullYear(),
                            start.getUTCMonth(),
                            start.getUTCDate() + 1
                        )
                    );
                }
                this.eventSource.push(result.data.event);
                this.myCal.loadEvents();
            }
        });
    }


}
