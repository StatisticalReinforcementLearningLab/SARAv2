import { Injectable } from '@angular/core';
import { UserProfile, UserProfileFixed } from './user-profile.model';
import { HttpClient } from '@angular/common/http';
//import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { NetworkService, ConnectionStatus } from '../../storage/network.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userProfile: UserProfile;
  userProfileFixed: UserProfileFixed;
  me = this;
  saveToServerRequestInQueue = false;
  initialLoading =  new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient,
              private networkSvc: NetworkService,
              private appVersion: AppVersion,
              private oneSignal: OneSignal) { }

  //returns Observable that we can subscribed to so as to trigger an action after 
  //user profiles have been initialized
  initializeObs(){
    //get profiles from server
    console.log("user-profile.service.ts - initializeObs method");
    let getProfile = this.http.post<any>(environment.userServer+'/userinfo',{"empty":"empty"}); 
    let getProfileFixed = this.http.get<any>(environment.userServer+'/userinfofixed');

    // forkJoin will return an observable that waits till both http requests have received responses
    return forkJoin([getProfile, getProfileFixed])
      .pipe(tap(
        response =>
        {
          console.log("in response of forkjoin");
          let response1=response[0];
          let response2=response[1];
          console.log("initializeObs response1: "+  JSON.stringify(response1));
          console.log("initializeObs response2: "+  JSON.stringify(response2));
          // console.log("initializeOb - response1.username: " + response1.username);
          // console.log("initializeOb - !response1.username: " + !response1.username);
          // console.log("initializeOb - !response1.hasOwnProperty('username'): " + !response1.hasOwnProperty('username'));

          if (!response1.username || !response1.hasOwnProperty('username') ){
            console.log("blank or empty user_name");
            const username = localStorage.getItem('loggedInUser');
            const currenttime:Date = new Date();
            const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
            this.userProfile = new UserProfile(username,[],0,0,currenttime.getTime(), dateString);
          }
          else{
            this.userProfile = response1;
            if(this.userProfile.hasOwnProperty("AwardDollarDates")){
              localStorage.setItem("AwardDollarDates", JSON.stringify( this.userProfile.AwardDollarDates));
            }
            localStorage.setItem("AwardDollar", JSON.stringify(this.userProfile.dollars));
          }
          this.userProfileFixed = response2;
          this.saveProfileToDevice();
          this.initialLoading.next(false);
        }
      ));
  }

  fetchUserProfile(){
    //get userProfile from server
    console.log("user-profile.service.ts - fetchUserProfile method");
    let getProfile = this.http.post<any>(environment.userServer+'/userinfo',{"empty":"empty"}); 

    return getProfile
      .pipe(tap(
        response =>
        {
          let serverCopyNewer = false;
          console.log("fetchUserProfile response: "+  JSON.stringify(response));
          // check if server copy is newer
          if(response.hasOwnProperty("lastupdate") && response.lastupdate > this.userProfile.lastupdate)
          {
            this.userProfile = response;
            if(this.userProfile.hasOwnProperty("AwardDollarDates")){
              localStorage.setItem("AwardDollarDates", JSON.stringify( this.userProfile.AwardDollarDates));
            }
            localStorage.setItem("AwardDollar", JSON.stringify(this.userProfile.dollars));
            this.userProfileFixed = response;
            this.saveProfileToDevice();
            serverCopyNewer = true;
          }
          else{
            serverCopyNewer = false;
          }         
          return { "serverCopyNewer": serverCopyNewer}
        }
      ));
  }


  fetchUserProfileFixed(){
    //get userProfileFixed from server
    console.log("user-profile.service.ts - fetchUserProfileFixed method");
    let getProfileFixed = this.http.get<any>(environment.userServer+'/userinfofixed');

    return getProfileFixed
      .pipe(tap(
        response =>
        {
          let changed = false;
          console.log("fetchUserProfileFixed response: "+  JSON.stringify(response));
          let receivedUserFixedProfile:UserProfileFixed = response;
          if(receivedUserFixedProfile.isActive !== this.userProfileFixed.isActive){
            this.userProfileFixed = response;
            this.saveProfileToDevice();
            changed = true;
          }
          return { "changed": changed}
        }
      ));
  }

  addOneSignalPlayerId(){
    this.oneSignal.getIds().then(async (id) =>  {
      const playerId = id.userId;
      this.userProfile.oneSignalPlayerId = id.userId;
      console.log("onesignal player id: " + id);
      this.saveProfileToDevice();
      this.saveToServer();
    });
  }

  addAppVersion(){
      this.appVersion.getVersionNumber().then(value => {
        this.userProfile.versionNumber = value;
        this.saveProfileToDevice();
        //this.saveToServer();
    }).catch(err => {
        console.log(err);
    });
  }
  /* 
  addReinforcementData returns true if successful at adding the element (it doesn't already exist for the given date)
  date is a string of the format YYYYMMDD (e.g. "20170430")
  
  reinforcementObj is an object of the form:
  {
      "ds": 1, //means participants completed the survey
      "prob": 0.23,
      "Like": "yes", //no if participants hated it.
      "reward": 1,  //0 means users were not randomized
      "reward_type": "meme", //'altruistic message'
      "reward_img_link": "img/reinforcements/memes/IM25.jpg"
  }
  */
  addReinforcementData(date:string, reinforcementObj:any):boolean{
    if(!(date in this.userProfile.reinfrocement_data)){
      this.userProfile.reinfrocement_data[date] = reinforcementObj;
      return true;
    }
    else{
      return false;
    }
  }

  // not currenlty using below method (wich calcs dollars based on days survey is taken in UserProfile)
  // instead allowing award-dollar.service to calc streaks
  calcDollars(){
    //this method calculates the number of three day streaks
    //then sets dollars = to number of three day streaks
    let previousDate = new Date("1970-01-01");
    let numStreaks = 0;
    let streak = 1;
    // console.log("calcDollars, # dates: " + this.userProfile.datesTaken.length);
    for(var i=0;i<this.userProfile.datesTaken.length;i++){
      let currentDateStr = this.userProfile.datesTaken[i];
      let currentDate = new Date(currentDateStr.substr(0,4)+ "-" + currentDateStr.substr(4,2)+ "-" + currentDateStr.substr(6,2));
      // console.log("calcDollars: " + currentDate);
      let daysDiff = Math.round((currentDate.getTime()	 - previousDate.getTime()	)/(1000*60*60*24));
      if (daysDiff ==0){ continue;}
      if(daysDiff ==1){
        streak++;
        // console.log("streak: "+ streak);
        if(streak ==3){
          numStreaks++;
          // reset
          previousDate = new Date("1970-01-01");  //set previousDate to 1970-01-01
          streak = 1;
        } 
      }else{
        //reset
        streak =1;
      }
      previousDate = currentDate;
    }  
    console.log("numStreaks: " + numStreaks);
    this.userProfile.dollars= numStreaks;
  }

  get isActive(){
    //console.log("user-profile.service.ts - isActive getter - begin");
    return this.userProfileFixed.isActive;
  }
  get isParent(){
    console.log("user-profile.service.ts - isParent getter - begin");  
    return this.userProfileFixed.isParent;
  }
  get points(){
    console.log("user-profile.service.ts - points getter - begin");
 
    if(this.userProfile==undefined)
      this.loadProfileFromDevice();
    return this.userProfile.points;
  }

  get username(){
    //console.log("user-profile.service.ts - username getter - begin");

    if(this.userProfile==undefined)
      this.loadProfileFromDevice();
    
    if(this.userProfile == null)
      return "new user"
    else
      return this.userProfile.username;
  }
  set username(username:string){
    console.log("user-profile.service.ts - isActive setter - begin");

    this.userProfile.username = username;
    this.saveProfileToDevice();
  }

  get versionNumber(){
    if(this.userProfile==undefined)
      this.loadProfileFromDevice();
    return this.userProfile.versionNumber;
  }
  set versionNumber(versionNumber:string){
    this.userProfile.versionNumber = versionNumber;
    this.saveProfileToDevice();
    this.saveToServer();
  }
  saveToServerSub :Subscription;

  get oneSignalPlayerId(){
    return this.userProfile.oneSignalPlayerId;
  }

  saveToServer(){ 
    this.saveToServerRequestInQueue = true;
    if(this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online){

      this.loadProfileFromDevice(); 
      const currenttime:Date = new Date();
      const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
      this.userProfile.lastuploadprofiletime = currenttime.getTime();
      this.userProfile.lastuploadprofiletime_ts = dateString;
      
      const userProfile: UserProfile = this.userProfile;

      this.http
        .post(environment.userServer+'/setuserinfo',userProfile)
        .subscribe(response =>{
          console.log("---userprofile: setuserinfo----");
          console.log(response);
          this.saveToServerRequestInQueue = false;
        });
    }
    else{
       this.saveToServerSub = this.networkSvc.onNetworkChange().subscribe(()=>{
          if(this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online){
            this.loadProfileFromDevice(); 
            const currenttime:Date = new Date();
            const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
            this.userProfile.lastuploadprofiletime = currenttime.getTime();
            this.userProfile.lastuploadprofiletime_ts = dateString;

            const userProfile: UserProfile = this.userProfile;
      
            this.http
              .post(environment.userServer+'/setuserinfo',userProfile)
              .subscribe(response =>{
                console.log("---userprofile: setuserinfo----");
                console.log(response);
                this.saveToServerRequestInQueue = false;
                this.saveToServerSub.unsubscribe();
              });
          }
      });

    }


      // console.log("saveToServer userProfile: " + JSON.stringify(userProfile));
  } 

  retrieve(userID: string){
  }
  getProfile(){
  }

  initTestProfile(){
    const currenttime:Date = new Date();
    const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
    const userProfile = new UserProfile('testy',  [], 0, 3, currenttime.getTime(), dateString);
    this.userProfile = userProfile;
    this.saveProfileToDevice();
    //STORE ON DEVICE
  }

  saveProfileToDevice(){
      localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
      
      // maybe use this logic in case it's undefined:  https://stackoverflow.com/questions/37417012/unexpected-token-u-in-json-at-position-0
      localStorage.setItem('userProfileFixed', JSON.stringify(this.userProfileFixed));

  }

  profileIsOnDevice(){
    if(localStorage.getItem('userProfile')!==null){
      return true;
    }
    else{
       return false;
    }
  }

  loadProfileFromDevice(){
    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
    this.userProfileFixed = JSON.parse(localStorage.getItem('userProfileFixed'));
    //temporarily commenting out below line (see other instance for more info)
    // this.userProfileFixed = JSON.parse(localStorage.getItem('userProfileFixed'));

  }

  // below method can be called when a survey has been completed
  // it does all the needed accounting
  // adds current date to dict (and array)
  public surveyCompleted(){
    console.log("user-profile.service.ts - surveyCompleted method - begin");

    const username = localStorage.getItem('loggedInUser'); //this.authService.loggedInUser.getValue()
    // check if survey has already been take for the current day or admin is contained in the username
    // console.log('surveyCompleted - before if loop');
    if(!this.surveyTakenForCurrentDay()|| username.indexOf('admin')>=0){
      // console.log('surveyCompleted - in if loop');
      this.addDateTaken();
      this.addSurveyPoints();
      //this.calcDollars();
      this.userProfile.lastupdate =this.numericCurrenDateTime;
      //Date: Feb 27, 22: mash is changing the readable date to an understandable format.
      //Dan for some reason changes the date to 12AM.
      const currenttime:Date = new Date();
      const dateString: string = moment(currenttime).format('MMMM Do YYYY, h:mm:ss a Z');
      // const dateString: string = moment(this.userProfile.lastupdate).format('MMMM Do YYYY, h:mm:ss a Z');
      this.userProfile.readable_ts = dateString;
      this.userProfile.lastuploadprofiletime = this.userProfile.lastupdate;
      this.userProfile.lastuploadprofiletime_ts = dateString;
      // console.log("in SurveyCompleted, AwardDollarDates: "+ localStorage.getItem("AwardDollarDates"));
      this.userProfile.AwardDollarDates = JSON.parse(localStorage.getItem("AwardDollarDates"));  //fetch AwardDollarDates from local storage and add it to the UserProfile
      try{
        this.userProfile.dollars = JSON.parse(localStorage.getItem("AwardDollar"));
      }catch(error){
        window.localStorage.setItem("AwardDollar", ""+0); 
        this.userProfile.dollars = 0;
      }
      this.saveProfileToDevice();
      this.saveToServer();
    }
  }

  get stringCurrenDate(){
    console.log("user-profile.service.ts - stringCurrenDate getter - begin");
    
    //shift hours back by 2, so that 2am, will register as 12am
    const hoursShift: number = 2;
    const currentDateTime : Date = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
    //now, set hours, min, sec to zero
    currentDateTime.setHours(0,0,0,0);
    return currentDateTime.getFullYear()
            + "" + ('0' + (currentDateTime.getMonth()+1)).slice(-2) 
            + "" + ('0' + currentDateTime.getDate()).slice(-2);
 }
  
  get numericCurrenDateTime(){
    console.log("user-profile.service.ts - numericCurrenDateTime getter - begin");

    //shift hours back by 2, so that 2am, will register as 12am
     const hoursShift: number = 2;
     const currentDateTime : Date = new Date();
     currentDateTime.setHours(currentDateTime.getHours() - hoursShift);
     //now, set hours, min, sec to zero
     currentDateTime.setHours(0,0,0,0);
     return currentDateTime.getTime();
  }

  addDateTaken(){
    console.log("user-profile.service.ts - addDateTaken method - begin");

    this.loadProfileFromDevice();
    const stringCurrenDate = this.stringCurrenDate;
    this.userProfile.datesTaken.push(stringCurrenDate);
    this.userProfile.survey_data.daily_survey[stringCurrenDate] = 1;
    this.saveProfileToDevice();
  }

  // boolean function, checks if survey has been taken for the current date.
  surveyTakenForCurrentDay(){
    console.log("user-profile.service.ts - surveyTakenForCurrentDay method - begin");

    this.loadProfileFromDevice();
    //check if date already exists in dict of dates, otherwise add the date to dict    
    // var hasMatch = false;
    if( this.stringCurrenDate in this.userProfile.survey_data.daily_survey){
      return true;
    }
    else{
      return false;
    }
  }

  addSurveyPoints(){
    console.log("user-profile.service.ts - addSurveyPoints method - begin");

    const pointsPerSurvey = 60;
    this.addPoints(pointsPerSurvey);
  }

  addPoints(points: number){
    console.log("user-profile.service.ts - addPoints method - begin");
    
    this.userProfile.points += points;
    this.userProfile.survey_data.points += points;
    this.saveProfileToDevice();
    this.saveToServer();
  }

  cheatPoints(points: number){
    console.log("user-profile.service.ts - cheatPoints method - begin");

    this.userProfile.points = points;
    this.userProfile.survey_data.points = points;
    this.saveProfileToDevice();
    this.saveToServer();
  }


  removeUserProfile(){
    localStorage.removeItem('userProfile');
  }

  medicationEvents(events){
    this.userProfile.medicationEvents = events;
    this.saveProfileToDevice();
    this.saveToServer();
  }

}
