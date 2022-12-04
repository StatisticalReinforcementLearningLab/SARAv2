import { CalendarComponent } from 'ionic2-calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AddEventModalPage } from './add-event-modal/add-event-modal.page';
// import { CalModalPage } from '../pages/cal-modal/cal-modal.page';

@Component({
    selector: 'app-medication-calendar',
    templateUrl: './medication-calendar.component.html',
    styleUrls: ['./medication-calendar.component.css']
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
            var eventType = Math.floor(Math.random() * 2);
            var startDay = Math.floor(Math.random() * 90) - 45;
            var endDay = Math.floor(Math.random() * 2) + startDay;
            var startTime;
            var endTime;
            if (eventType === 0) {
                startTime = new Date(
                    Date.UTC(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate() + startDay
                    )
                );
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(
                    Date.UTC(
                        date.getUTCFullYear(),
                        date.getUTCMonth(),
                        date.getUTCDate() + endDay
                    )
                );
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true,
                });
            } else {
                var startMinute = Math.floor(Math.random() * 24 * 60);
                var endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + startDay,
                    0,
                    date.getMinutes() + startMinute
                );
                endTime = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + endDay,
                    0,
                    date.getMinutes() + endMinute
                );
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false,
                });
            }
        }
        this.eventSource = events;
        console.log(JSON.stringify(events))
    }

    removeEvents() {
        this.eventSource = [];
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
