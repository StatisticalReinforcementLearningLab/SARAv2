//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,

import { Injectable } from '@angular/core';
import * as moment from 'moment';

interface StoreObj {
    date: string,
    data: any
}

@Injectable({
    providedIn: 'root'
})

export class StoreBaseService {
    protected STORAGE_REQ_KEY;

    constructor() { 
    }

    protected storeResultLocally(surveyResult) {
        let obj: StoreObj = {
            date: moment().format('YYYYMMDD'),
            data: surveyResult
        };
    
        console.log("Before saveJsonObjLocally: "+this.STORAGE_REQ_KEY);
        if(window.localStorage.getItem(this.STORAGE_REQ_KEY) == undefined ) {
            var storedObj = [obj];
            window.localStorage.setItem(this.STORAGE_REQ_KEY, JSON.stringify(storedObj));
        } else {
            this.saveJsonObjLocally(obj);
        }
    } 
    
    protected saveJsonObjLocally(obj) {
        var storedObj =  this.getLocalData();      
        console.log("before push survey to local storage: "+JSON.stringify(storedObj));
        storedObj.push(obj);
        console.log("after push survey to loca storage: "+JSON.stringify(storedObj));
        // Save old & new local transactions back to Storage
        window.localStorage.setItem(this.STORAGE_REQ_KEY, JSON.stringify(storedObj));
        
    }      
        
    protected getLocalData(){       
        return JSON.parse(window.localStorage.getItem(this.STORAGE_REQ_KEY));
    }

    protected clearLocalData(){
        window.localStorage.removeItem(this.STORAGE_REQ_KEY);
    }      
}

  