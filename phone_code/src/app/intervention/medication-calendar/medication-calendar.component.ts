import { CalendarComponent } from 'ionic2-calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AddEventModalPage } from './add-event-modal/add-event-modal.page';
import { DateRangeUnit } from 'aws-sdk/clients/securityhub';
import { AddMedicationPage } from './add-medication/add-medication.page';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { UploadserviceService } from 'src/app/storage/uploadservice.service';
import { Subject } from 'rxjs';
// import { CalModalPage } from '../pages/cal-modal/cal-modal.page';

declare var certiscan: any

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
    isMedicationListRefreashing = false;
    medication_list = [];
    alertButtons = [];
    alertInputs = [];

    segmentChanged(ev: any) {
        console.log('Segment changed', ev.detail["value"]);
        this.type = ev.detail["value"];
    }

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    //
    medicationListChanged$ = new Subject<any>();
    privateUploadListner: any;
    @ViewChild(CalendarComponent, null) myCal: CalendarComponent;

    constructor(private modalCtrl: ModalController,
        private userProfileService: UserProfileService,
        private uploadService: UploadserviceService,
        public plt: Platform,
        public httpClient: HttpClient) {

    }

    ngOnInit() { }

    ngAfterViewInit(): void {
        console.log("---get private data----");

        this.medicationListChanged$.subscribe(events => {
            console.log("Length of private data: ", events.length);
            console.log("Recieved Private Value: ", JSON.stringify(events));
            events = this.updateMedicationList(events);
            this.eventSource=[];
            this.eventSource=events;
            //this.myCal.loadEvents();

            if(this.isMedicationListRefreashing == true){
                //means we disabled the calendar
                //we need to enable again.
                this.isMedicationListRefreashing = false;
            }
        });
        
        this.fetchPrivateDataFromWeb();

        //subscribe to an observable in a service, 
        if(this.privateUploadListner){
            this.privateUploadListner.unsubscribe();
        }else{
            this.privateUploadListner = this.uploadService.privateUploadCompleted$;
            this.privateUploadListner.subscribe(message => {
                console.log("Message: ", message);
                //this.fetchPrivateDataFromWeb();
            });
        }
        this.myCal.lockSwipes = true;


        

        if(window.localStorage.hasOwnProperty('medication_list')){
            console.log("Medication list: Medication list loaded from storage");
            this.medication_list = JSON.parse(window.localStorage.getItem('medication_list')); 
        }else{
            console.log("Medication list: Medication list not available in storage");
            this.medication_list = [
                {
                    "img": "assets/img/med1.svg",
                    "name": "6MP",
                    "dosage": "once daily"
                }
            ];
            window.localStorage.setItem('medication_list', JSON.stringify(this.medication_list));
        }
        // this.medication_list = [
        //     {
        //         "img": "assets/img/med1.svg",
        //         "name": "med-1",
        //         "dosage": "two times a day"
        //     },
        //     {  
        //         "img": "assets/img/med2.svg",
        //         "name": "med-2",
        //         "dosage": "three time a day"
        //     }

        // ];

        //alert buttons/input
        this.alertButtons = [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Alert canceled');
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: (alertData) => { //takes the data 

                console.log(JSON.stringify(alertData));
                let new_medication = {
                    "img": "assets/img/med1.svg",
                    "name": alertData.med_name,
                    "dosage": alertData.dosage
                };
                this.medication_list.push(new_medication);
                //this.medication_list = [];
                window.localStorage.setItem('medication_list', JSON.stringify(this.medication_list));
                this.saveMedicationList(this.medication_list);
              },
            },
        ];
        //
        this.alertInputs = [
            {
              placeholder: 'Medication name',
              name: 'med_name',
            },
            {
                placeholder: 'Dosage',
                name: 'dosage',
            },
            // {
            //   placeholder: 'Nickname (max 8 characters)',
            //   attributes: {
            //     maxlength: 8,
            //   },
            // },
            // {
            //   type: 'number',
            //   placeholder: 'Age',
            //   min: 1,
            //   max: 100,
            // },
            // {
            //   type: 'textarea',
            //   placeholder: 'A little about yourself',
            // },
        ];
    } 
    
    fetchPrivateDataFromWeb(){
        //this.uploadService.getPrivateUserData().subscribe((d) => console.log("Recieved Private Value", d));
        this.uploadService.getPrivateUserData().subscribe((d) =>  {

            var events = [];
            var eventDateStrings = [];
            var eventDateIntakeStatus = [];
            let privateUserData_web = JSON.parse(d); // Add medication data.
            console.log("====Private data web: " + privateUserData_web);

            var events_web_ts = -1;
            var events_web = [];
            if(d !== null){
                //Here we only process once the web call is done.
                //Otherwise, we retain the local copy at the start.
                if("medication_data" in privateUserData_web){
                    var medication_data_web = privateUserData_web['medication_data'];
                    events_web = medication_data_web['events'];
                    events_web_ts = medication_data_web['ts'];
                }
            }

            var events_local_ts = -1;
            var events_local = [];
            let privateUserData_local = JSON.parse(window.localStorage.getItem('private_user_data')); 
            console.log("====Private data local: " + privateUserData_local);
            if((window.localStorage.getItem("private_user_data") !== null) 
                && ("medication_data" in privateUserData_local)){
                var medication_data_local = privateUserData_local['medication_data'];
                events_local = medication_data_local['events'];
                events_local_ts = medication_data_local['ts'];
            }

            //take one with higher timestamp, as it is newer
            events = events_local;
            if(events_local_ts < events_web_ts){
                events = events_web;
                //if web copy is newer, we can save the web data to local data.
                window.localStorage.setItem('private_user_data', JSON.stringify(privateUserData_web));
                console.log("using web copy; web:" + events_web_ts + " local:"+events_local_ts);
            }else{
                //console.log("using local copy");
                console.log("using local copy; web:" + events_web_ts + " local:"+events_local_ts);
            }

            //Implications and corner case considerations
            //If web version is newer (i.e., higher ts value), we take that version
            //-- If no web data on medication exist, then events_web_ts = -1 
            //   and events_local_ts has a value. We retain the events_local copy as events. (ToDo, probably upload local copy)
            //-- If no local data on medication exist, then events_local_ts = -1 and events_web_ts has a value. 
            //   We retain the web copy of the events.
            //-- If no local or web data on medication exist, then 
            //   events_local_ts < events_web_ts is false, we retain the copy of events_local, which is [].

            //Other corner case handling:
            //If web data is older, then we upload the local copy to the web
            //Corner case is if events_web_ts=-1, i.e., no web data exist. Then this will upload the local copy. 
            if(events_web_ts < events_local_ts){
                this.uploadService.uploadPrivateData(privateUserData_local);
            }

            //if events is empty, then we don't update anything as events.length is zero.
            for (var i = 0; i < events.length; i++) {
                //convert string back to date objects.
                events[i].startTime = new Date(events[i].startTime);
                events[i].endTime = new Date(events[i].endTime);
                events[i].medicationIntakeTime = new Date(events[i].medicationIntakeTime);
            }

            //load medication list
            //Here, we do something simple, we merge the list
            //from online and offline, create a longer list
            var medication_list_to_merge = [];
            if((window.localStorage.getItem("private_user_data") !== null) 
                && ("medication_list" in privateUserData_web) && ("medication_list" in privateUserData_web['medication_list'])){
                medication_list_to_merge = privateUserData_web['medication_list']['medication_list']; //this is already parsed as JSON object
            }
            console.log("medication_list_to_merge: " + JSON.stringify(medication_list_to_merge));
            console.log("this.medication_list: " + JSON.stringify(this.medication_list));
            // this.medication_list = [...new Set([...this.medication_list, ...medication_list_to_merge])];
            // this.saveMedicationList(this.medication_list);
            this.medication_list = this.mergeTwoMedicationsList(this.medication_list, medication_list_to_merge);
            console.log("Medication list: Saving medication list after merging web and local");
            window.localStorage.setItem('medication_list', JSON.stringify(this.medication_list));

            //this.eventSource = events;
            this.medicationListChanged$.next(events);
        });
    }

    mergeTwoMedicationsList(medication_list1, medication_list2){
        // medication_list1 = [{"img":"assets/img/med1.svg","name":"6MP","dosage":"once daily"}];
        // medication_list2 = [{"img":"assets/img/med1.svg","name":"6MP2","dosage":"once daily"}];

        var medication_list_union = [];
        var medication_list1Length = medication_list1.length;
        var medication_names = [];
        for (var i = 0; i < medication_list1Length; i++) {
            medication_list_union.push(medication_list1[i]);
            medication_names.push(medication_list1[i]['name']);
        }

        var medication_list2Length = medication_list2.length;
        for (var i = 0; i < medication_list2Length; i++) {
            //medication_list_union.push(medication_list1[i]);
            let temp_name = medication_list2[i]['name'];
            var index2 = medication_names.indexOf(temp_name);
            if(index2 == -1){ 
                //means the medication does not exist in the new list
                medication_names.push(medication_list2[i]['name']);
                medication_list_union.push(medication_list2[i]);
            }
        }

        console.log("medication_list_union: " + JSON.stringify(medication_list_union));
        console.log("medication_names: " + JSON.stringify(medication_names));
        return medication_list_union;

        // var tmp1 = medication_list1.map(function(obj) {
        //     return obj.name;
        //   });
        // var tmp2 = medication_list2.map(function(obj) {
        //     return obj.name;
        //   });

        // console.log("tmp1: " + JSON.stringify(tmp1));
        // console.log("tmp2: " + JSON.stringify(tmp2));
        // tmp1.forEach(function(id1, index1) {
        //     var index2 = tmp2.indexOf(id1);
        //     if (index2 == -1) {
        //         //means we found an element in tmp1 that does not exist in tmp2
        //     }
        // });
    }

    reloadCalendarDataOnly(){
        this.myCal.loadEvents();
    }
    
    //format ecap data
    formatEcapData(ecapJSONData: any){
        // let isSuccess = ecapJSONData['success'];
        let ecapScanDates = [];
        let ecapScanDateStrings = [];
        // if(isSuccess == true){
        console.log('ecap_record: formatEcapData: ', typeof(ecapJSONData));
        if (typeof ecapJSONData === 'string')
            ecapJSONData = JSON.parse(ecapJSONData);

        console.log('ecap_record: formatEcapData: ', ecapJSONData);
        if("tag_message" in ecapJSONData){
            ecapJSONData = ecapJSONData["tag_message"];
        }
        // let scanTime = ecapJSONData['scan_time'];
        // console.log("ecap_record:: scanTime: " + scanTime + ", " + moment.unix(scanTime).format("DD-MM-YYYY HH:mm:ss a"));
        let eventCount = ecapJSONData['event_count'];
        if(eventCount > 0){
            //means there is a tag message
            let timestamps = ecapJSONData['tag_events'];
            for (const timestamp of timestamps) {
                // This conversion is giving the local timezone.
                // console.log("ecap_record:: timestamp: " + timestamp["timestamp"] + ", " + moment.unix(timestamp["timestamp"]).format("MM-DD-YYYY HH:mm:ss a"));
                ecapScanDates.push(moment.unix(timestamp["timestamp"]).toDate());
                ecapScanDateStrings.push(moment.unix(timestamp["timestamp"]).format("MM-DD-YYYY"));
            }
        }
        //}

        // What we do is we take all the dates from first day of the ecap records.
        // Then we add all scan dates as green. And rest as x.
        var events = [];
        let maxDateInEcap = new Date(Math.max.apply(null,ecapScanDates));
        let maxDateInEcapString = moment(maxDateInEcap).format("MM-DD-YYYY");
        let minDateInEcap = new Date(Math.min.apply(null,ecapScanDates));
        // console.log(maxDateInEcap);
        // console.log(minDateInEcap);
        // console.log(ecapScanDates);
        let runningDateTime = minDateInEcap;
        var i = 0;
        while(true){
            let runningDateTimeStr = moment(runningDateTime).format("MM-DD-YYYY");
            if(ecapScanDateStrings.includes(runningDateTimeStr)){
                events.push({
                    title: 'Day-' + i,
                    medicationIntakeTime: new Date(runningDateTime),
                    startTime: new Date(runningDateTime.setHours(1, 0, 0, 0)),
                    endTime: new Date(runningDateTime.setHours(1, 1, 0, 0)),
                    allDay: false,
                    descritpion: "6mp taken",
                    symbolType: "checkmark"
                });
            }else{
                events.push({
                    title: 'Day-' + i,
                    medicationIntakeTime: new Date(runningDateTime),
                    startTime: new Date(runningDateTime.setHours(1, 0, 0, 0)),
                    endTime: new Date(runningDateTime.setHours(1, 1, 0, 0)),
                    allDay: false,
                    descritpion: "6mp taken",
                    symbolType: "cross"
                });
            }
            //runningDateTime.setHours(24, 1, 0, 0);
            runningDateTime.setDate(runningDateTime.getDate() + 1);
            //console.log(runningDateTime);
            i = i + 1;
            if(runningDateTimeStr == maxDateInEcapString)
                break;
        }
        //console.log(events);
        return events;
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

    ionViewDidEnter() {
        console.log("medicationCalendar.ts --- ionViewDidEnter");
        //this.child.loadFunction();
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
        console.log(JSON.stringify(events));
        //window.localStorage.setItem('eventSource', JSON.stringify(events));
        this.saveMedicationEvents(events);
    }

    saveMedicationList(medication_list){
        let privateUserDataStr = window.localStorage.getItem('private_user_data');
        var privateUserData = {}
        console.log("privateUserDataStr: " + privateUserDataStr);
        if((privateUserDataStr != "undefined") && (privateUserDataStr != null))
            privateUserData = JSON.parse(privateUserDataStr);


        var medicationLocalUpdateTime = new Date().getTime();
        var medications = {};
        medications['medication_list'] = medication_list;
        medications['ts'] = medicationLocalUpdateTime;
        privateUserData['medication_list'] = medications;

        console.log("---Uploading medication data----");
        this.uploadService.uploadPrivateData(privateUserData); //here we are uploading data.
        window.localStorage.setItem('private_user_data', JSON.stringify(privateUserData));
    }

    saveMedicationEvents(events) {

        // we will be to stopping saving to userprofile from now on
        window.localStorage.setItem('eventSource', JSON.stringify(events));
        this.userProfileService.medicationEvents(events);

        //encrypt and send it to private end of the server.


        let privateUserDataStr = window.localStorage.getItem('private_user_data');
        var privateUserData = {}
        console.log("privateUserDataStr: " + privateUserDataStr);
        if((privateUserDataStr != "undefined") && (privateUserDataStr != null))
            privateUserData = JSON.parse(privateUserDataStr);
        var medication_data = {};
        medication_data['events'] = events;
        var readableSurveyEndTime = moment().format('MMMM Do YYYY, h:mm:ss a Z');
        medication_data['readable_ts'] = readableSurveyEndTime;
        medication_data['userName'] = this.userProfileService.username;
        medication_data['devicInfo'] = this.plt.platforms(); //Type of device; iOS or Android
        var medicationLocalUpdateTime = new Date().getTime();
        medication_data['ts'] = medicationLocalUpdateTime;
        privateUserData['medication_data'] = medication_data;

        console.log("---Uploading medication data----");
        this.uploadService.uploadPrivateData(privateUserData); //here we are uploading data.
        window.localStorage.setItem('private_user_data', JSON.stringify(privateUserData));

        // this.userProfileService.userProfile.medicationEvents = events;
        // console.log(JSON.stringify(this.userProfileService.userProfile));
        // this.userProfileService.saveToServer();
        // this.userProfileService.saveProfileToDevice();

        //Record for medication
        //this.saveSensitiveDataLocally(events);
    }

    removeEvents() {
        this.eventSource = [];
    }

    addMedication(dateStr) {
        console.log(dateStr);
        //this.openAddEventModal();
        this.openAddMedicationModal(dateStr);
    }

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
                this.updateMedicationCalendarEventAfterManualAdd(medicationSelectData);
        });

        await modal.present();
    } 

    updateMedicationCalendarEventAfterManualAdd(medicationSelectData: any) {
        // Called after updating the medication list manually from the modal
        let date_string = medicationSelectData["date_string"];
        let medicationTaken = medicationSelectData["medication_taken"];
        let isMedicationOnHold = medicationSelectData["is_medication_on_hold"];

        console.log("medicationTaken " + medicationTaken);
        var events = this.eventSource;
        if(medicationTaken == true){
            var dStart;
            let date_obj = new Date(date_string); //Time of the
            for(var i = events.length-1; i >= 0 ; i -= 1) {
                dStart = events[i].startTime;
                if (date_obj.getTime() === dStart.getTime()){
                    events[i].symbolType = "checkmark";
                    events[i].descritpion = "6mp taken";
                    break;
                }
            }
            this.saveMedicationEvents(events);
            this.medicationListChanged$.next(events);
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
                return date_str + " - 6MP likely not taken.";
            }
        } else {
            return "";
        }
    }

    //initialize medication list
    initializeMedicationList(){

    }

    //update medication list
    updateMedicationList(events){
        /*
        In this function, we update the "add" for the current to last three day.
        If medication is not added then we fill them with x.
        */

        //var events = this.eventSource;

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

        //If there is no event in events calendar then get the first day in study as maxDateInEvents
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
                //Nov 30, 2024: We only add "+" if the data is higher than maxDate
                //Also, note for the day, the time ithDayFromCurrentdayMidnightUTC is 1am in the morning. So,
                //for the current day, it won't be adding a "+" if there is a medication in the current day.
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
        // Nov 30, 2024: this line is correcting any previous "add" symbol in events.
        let twoDayFromCurrentdayMidnightUTC = ithDayFromCurrentdayMidnightUTC;
        console.log("twoDayFromCurrentdayMidnightUTC " + twoDayFromCurrentdayMidnightUTC);
        for(var i=0; i<events.length; i++){
            //if starttime for event is less or equal to ithDayFromCurrentdayMidnightUTC
            if((events[i].startTime < twoDayFromCurrentdayMidnightUTC) && (events[i].symbolType == "add"))
                events[i].symbolType = "cross";
        }

        // //Fill in any date that does not exist with a "x". Stop at "maxDateInEvents"
        // This will only add x, since we had last record.
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
        //console.log("After: " + JSON.stringify(events, null, 4));

        //this.eventSource = events;
        //this.saveMedicationEvents(events);
        //console.log('===ecap_scanned===' + JSON.stringify(events, null, 4));

        // for(var i=0; i<100; i++){
        //     ithDayFromCurrentdayMidnightUTC = new Date(currentDayMidnightUTC.setHours(-1 * 24 * i, 1, 0, 0));
        //     //Two scenario may happen
        //     //If we have an add symbol then change to X.
        //     //
        // }
        return events;

    }

    openEcap() {
        let me = this;
        certiscan.scan(function(responseTxt) {
            // alert(responseTxt);
            // Put the object into storage
            me.isMedicationListRefreashing = true;
            window.localStorage.setItem('ecap_response', JSON.stringify(responseTxt));
            console.log("--- ecap_response" + responseTxt);
            me.getEcapsMedicationList(responseTxt);
        })
    }

    insertCalendarDataFromLocal(){
        const spec = "/assets/data/ecaps_data_12032024.json";
        //const spec = "/assets/data/ecaps_demo_data.json";
        let me = this;
        this.httpClient.get(spec)
            .subscribe(async (res: any) => {
                console.log("==========");
                // res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["Date"]
                console.log(res);
                window.localStorage.setItem('ecap_response', JSON.stringify(res));
                me.getEcapsMedicationList(res);
            });
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // insertMedicationIntoList(){
    //     let new_medication = {
    //         "img": "assets/img/med1.svg",
    //         "name": "med-" + this.getRandomInt(100),
    //         "dosage": "once a day"
    //     };
    //     this.medication_list.push(new_medication);
    // }

    getEcapsMedicationList(responseTxt) {
        // print prior ecap record if exists:
        // ----Retrieve the object from storage
        if(window.localStorage.hasOwnProperty('ecap_response')){
            let retrievedObject = window.localStorage.getItem('ecap_response'); // reading as a string??
            console.log("--- ecap_response 2" + retrievedObject);
            //console.log('ecap_record: ', JSON.parse(retrievedObject));
            var res;
            if(responseTxt == undefined)
                res = JSON.parse(retrievedObject);
            else
                res = responseTxt;
            var events = this.formatEcapData(res); // Formats eCap to events. This will fill in any missing value between first and last scan.  
            events = this.updateMedicationList(events); // This will add anything since last scan to today.

            //me.eventSource = events;
            this.saveMedicationEvents(events);
            this.medicationListChanged$.next(events);

            // console.log('===ecap_scanned: events===' + JSON.stringify(events.reverse()));
            // console.log('===ecap_scanned: eventsource===' + JSON.stringify(me.eventSource));
            //let me = this;
            // setTimeout(() => {
            //     me.updateMedicationList();// also save, saves to userprofile as well.
            //     console.log('===ecap_scanned 2===' + JSON.stringify(events));
            //     console.log('===ecap_scanned 2===' + JSON.stringify(me.eventSource));
            //     me.myCal.loadEvents();
            // }, 100);
        }else{
            console.log('ecap_record: no record');
        }

        //if (Capacitor.isNativePlatform()) {
        // if (Capacitor.isNativePlatform() == false) {
        //     // do something
        //     //Here, we are taking data from the demo.
        //     //----
        //     const spec = "/assets/data/ecaps_demo_data_2.json";
        //     //const spec = "/assets/data/ecaps_demo_data.json";
        //     let me = this;
        //     this.httpClient.get(spec)
        //         .subscribe(async (res: any) => {
        //             console.log("==========");
        //             // res["datasets"]["data-aac2a29e1b23308d5471fb5222ef6c6c"][i]["Date"]
        //             console.log(res);
        //             let events = this.formatEcapData(res);
        //             //this.eventSource = events;
        //             this.eventSource = this.updateMedicationList(events);// also save

        //             //save the medication to server as private data
        //             //me.userProfileService.savePrivateData('medication_data', events);

        //             //upload to private data here
        //             //mock private upload
        //             //this.uploadService.uploadPrivateData({'mock': "mock private data"});
        //             //this.uploadService.getPrivateUserData();
        //             // let privateUserDataStr = window.localStorage.getItem('private_user_data');
        //             // var privateUserData = {}
        //             // console.log("privateUserDataStr: " + privateUserDataStr);
        //             // if(privateUserDataStr != "undefined")
        //             //     privateUserData = JSON.parse(privateUserDataStr);
        //             // privateUserData['medication_data'] = events;
        //             // console.log("---Uploading medication data----");
        //             // me.uploadService.uploadPrivateData(privateUserData);
        //             // window.localStorage.setItem('private_user_data', JSON.stringify(responseTxt));
        //         });
        // }
    
        
    }
}


