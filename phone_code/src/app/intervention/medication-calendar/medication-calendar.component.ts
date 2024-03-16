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
                // events = [
                //     {
                //         "title": "Day -0",
                //         "startTime": "2024-01-18T08:01:00.000Z",
                //         "endTime": "2024-01-18T09:01:00.000Z",
                //         "medicationIntakeTime": "2024-01-18T08:01:00.000Z",
                //         "allDay": false,
                //         "descritpion": "6mp add",
                //         "symbolType": "add"
                //     }, 
                //     {
                //         "title": "Day -0",
                //         "startTime": "2024-01-20T08:01:00.000Z",
                //         "endTime": "2024-01-20T09:01:00.000Z",
                //         "medicationIntakeTime": "2024-01-20T08:01:00.000Z",
                //         "allDay": false,
                //         "descritpion": "6mp add",
                //         "symbolType": "add"
                //     }, 
                //     {
                //         "title": "Day -0",
                //         "startTime": "2024-01-19T08:01:00.000Z",
                //         "endTime": "2024-01-19T09:01:00.000Z",
                //         "medicationIntakeTime": "2024-01-19T08:01:00.000Z",
                //         "allDay": false,
                //         "descritpion": "6mp add",
                //         "symbolType": "add"
                //     }
                // ]
                var countData = events.length;
                for (var i = 0; i < countData; i++) {
                    //Convert string back to date objects.
                    events[i].startTime = new Date(events[i].startTime);
                    events[i].endTime = new Date(events[i].endTime);
                    events[i].medicationIntakeTime = new Date(events[i].medicationIntakeTime);
                }
                this.eventSource = events;
                // console.log(this.eventSource);
                this.updateMedicationList();
            }
        }, 100);
        // console.log(JSON.stringify(this.userProfileService.userProfile));
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
            // Date behavior
            // Date() call gives current time in the current time zone.
            // If I call to string, then it will save current time plus 8 (for pacific).
            // Thus time is saved in GMT
            // So, if I set the time at current Date and set minutes to 1 then
            // Then save string will save hours as 8 and minutes as 1. 
            // So, when I load from string again, would it mess up the date??
            var date = new Date();
            var startTime = new Date(new Date().setHours(-1 * 24 * i, 1, 0, 0));
            var endTime = new Date(new Date().setHours(-1 * 24 * i + 1, 1, 0, 0));

            var eventType = Math.floor(Math.random() * 2); //0=no survey, 1 survey.

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
            let date_obj = new Date(date_string); //Time of the 
            for(var i = this.eventSource.length-1; i >= 0 ; i -= 1) {
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

    showEventDetails(events){
        //console.log(JSON.stringify(events));
        if((events.length == 1) && ("title" in events[0])){
            var date_clicked = events[0];
            let date_str = moment(date_clicked["startTime"]).format('MM/DD/YYYY'); 
            if (date_clicked["symbolType"] == "checkmark"){
                let time_taken = moment(date_clicked["medicationIntakeTime"]).format('hh:mm A'); 
                return date_str + " - 6MP taken at " + time_taken;
            }else if(date_clicked["symbolType"] == "add"){
                return date_str + " - Record unavailable.";
            }else{
                return date_str + " - 6MP likely not taken.";;
            }
        } else {
            return "";
        }
    }

    //initialize medication list
    initializeMedicationList(){

    }

    //update medication list
    updateMedicationList(){
        /*
        In this function, we update the "add" for the current to last three day.
        If medication is not added then we fill them with x.
        */

        var events = this.eventSource;

        //find the max Date In Events 
        //Later we will use this fill in + and x signs.
        //Ideally we have to fill until the maxDateInEvents
        //because before everything is already filled.
        var maxDateInEvents = new Date("1970-01-01");
        for (var i = 0; i < events.length; i += 1){
            if(maxDateInEvents.getTime() < events[i].startTime.getTime()){
                maxDateInEvents = events[i].startTime;
            }
        }

        //If there is not event in events calendar then get the first day in study as maxDateInEvents
        //or set the current date as maxDateInEvents
        // maxDateInEvents = new Date("2024-02-01");
        // events = [];
        if(events.length == 0){
            //get first day of survey as set as maxDateInEvents
            var dailySurveyHistory = this.userProfileService.userProfile.survey_data.daily_survey;
            if(Object.keys(dailySurveyHistory).length > 0){//Survey is not empty
                var firstDateSurveyIsCompleted = moment().format('YYYYMMDD');
                var timestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted, "YYYYMMDD");
                var timestampDateForASurveyCompleted;
                for (var dateForASurveyCompleted in dailySurveyHistory) {
                    timestampDateForASurveyCompleted = moment(dateForASurveyCompleted,"YYYYMMDD");
                    if (timestampDateForASurveyCompleted < timestampeForFirstDataSurveyIsCompleted) {
                        firstDateSurveyIsCompleted = dateForASurveyCompleted;
                        timestampeForFirstDataSurveyIsCompleted = moment(firstDateSurveyIsCompleted,"YYYYMMDD");
                    }
                }
                maxDateInEvents = new Date(moment(firstDateSurveyIsCompleted, "YYYYMMDD").toDate().setHours(1, 1, 0, 0));
            }else{
                maxDateInEvents = new Date(new Date().setHours(0, 1, 0, 0));
            }
            //else set current date as maxDateInEvents; this is first day in study
        }
        console.log("maxDateInEvents: " + firstDateSurveyIsCompleted);

        let currentDayMidnightUTC = new Date(new Date().setHours(0, 1, 0, 0));

        //Add the + add sign to the last 3 days
        //Just before "maxDateInEvents" or until 3, whichever comes first.
        //If current date is "22 Jan 2024" and maxDateInEvents "20 Jan 2024" then we add for 22 and 21.
        //If current date is "22 Jan 2024" and maxDateInEvents "10 Jan 2024" then we add for 22, 21, 20.
        var ithDayFromCurrentdayMidnightUTC;
        for(var i=0; i<3; i++){
            ithDayFromCurrentdayMidnightUTC = new Date(new Date().setHours(-1 * 24 * i, 1, 0, 0));
            console.log("ithDayFromCurrentdayMidnightUTC " + ithDayFromCurrentdayMidnightUTC + ", i " + i);
            if(maxDateInEvents.getTime() <= ithDayFromCurrentdayMidnightUTC.getTime()){
                //means we have a new day, we need to "add" symbol.
                events.push({
                    title: 'Day -' + i,
                    startTime: ithDayFromCurrentdayMidnightUTC,
                    endTime: new Date(ithDayFromCurrentdayMidnightUTC.setHours(1, 1, 0, 0)),
                    medicationIntakeTime: ithDayFromCurrentdayMidnightUTC,
                    allDay: false,
                    descritpion: "6mp add",
                    symbolType: "add"
                });
            }
        }


        // //ithDayFromCurrentdayMidnightUTC now the two day. Any existing event with
        // //date less than ithDayFromCurrentdayMidnightUTC with "+/add" sign should be cross now.
        let twoDayFromCurrentdayMidnightUTC = ithDayFromCurrentdayMidnightUTC;
        console.log("twoDayFromCurrentdayMidnightUTC " + twoDayFromCurrentdayMidnightUTC);
        for(var i=0; i<events.length; i++){
            //if starttime for event is less or equal to ithDayFromCurrentdayMidnightUTC
            if((events[i].startTime < twoDayFromCurrentdayMidnightUTC) && (events[i].symbolType == "add"))
                events[i].symbolType = "cross";
        }

        // //Fill in any date that does not exist with a "x". Stop at "maxDateInEvents"
        console.log("Before: " + JSON.stringify(events));
        var ithDayFromTwoDayFromCurrentdayMidnightUTC;
        var dayToAdjustFrom;
        for(var i=1; i<100; i++){
            //We have to reset everytime, because set hours changes the date for the future
            dayToAdjustFrom = new Date("" + twoDayFromCurrentdayMidnightUTC); 
            ithDayFromTwoDayFromCurrentdayMidnightUTC = new Date(dayToAdjustFrom.setHours(-1 * 24 * i, 1, 0, 0));
            console.log("ithDayFromTwoDayFromCurrentdayMidnightUTC " + ithDayFromTwoDayFromCurrentdayMidnightUTC + ", i " + i);
            if(maxDateInEvents.getTime() < ithDayFromTwoDayFromCurrentdayMidnightUTC.getTime()){
                events.push({
                    title: 'Day -' + i,
                    startTime: ithDayFromTwoDayFromCurrentdayMidnightUTC,
                    endTime: new Date(ithDayFromTwoDayFromCurrentdayMidnightUTC.setHours(1, 1, 0, 0)),
                    medicationIntakeTime: ithDayFromTwoDayFromCurrentdayMidnightUTC,
                    allDay: false,
                    descritpion: "6mp add",
                    symbolType: "cross"
                });
            }else{
                break; //means we have all the records.
            }
        }
        console.log("After: " + JSON.stringify(events));

        this.eventSource = events;
        this.saveMedicationEvents(events);

        // for(var i=0; i<100; i++){
        //     ithDayFromCurrentdayMidnightUTC = new Date(currentDayMidnightUTC.setHours(-1 * 24 * i, 1, 0, 0));
        //     //Two scenario may happen
        //     //If we have an add symbol then change to X.
        //     //
        // }

    }



}
