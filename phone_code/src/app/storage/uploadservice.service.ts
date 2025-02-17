import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom, map, Observable, of, Subject, switchMap } from 'rxjs';
// import { Queue } from '/queue.ts';
import { Queue, UploadItem } from './queue';
import { EncrDecrService } from './encrdecrservice.service';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})


export class UploadserviceService {

    myObservable;
    uploadQueue;
    isUploading;
    //what are the different upload services
    //-- Only uses accesstoken for follow up communication: get intervention messages, get memes/altruism/intervention messages
    //-- Upload from a queue. I do not need any feedback. App usage, survey upload, intervetion/reinforcement randomization upload.
    //---- What does the queue need: data, location, type, encrypt or not.
    privateUploadCompleted$ = new Subject<any>();

    constructor(private http: HttpClient, private EncrDecr: EncrDecrService) {

        this.myObservable = new Observable(observer => {
            observer.next(1);
            observer.next(2);
            observer.next(3);
        });

        this.uploadQueue = new Queue();
        this.isUploading = false;
    }

    saveAppUsageEnter(page_name) {
        var item = new UploadItem();
        item.isEncrypted = false;
        item.data = { "page_name": page_name, "type": "enter", 'unix_ts': new Date().getTime(), 'readable_ts': moment().format('MMMM Do YYYY, h:mm:ss a Z')};
        item.typeOfData = 'app_usage';
        item.uploadURLLocation = '';
        this.addToUploadQueue(item);
    }

    saveAppUsageExit(page_name) {
        var item = new UploadItem();
        item.isEncrypted = false;
        item.data = { "page_name": page_name, "type": "exit", 'unix_ts': new Date().getTime(), 'readable_ts': moment().format('MMMM Do YYYY, h:mm:ss a Z')};
        item.typeOfData = 'app_usage';
        item.uploadURLLocation = '';
        this.addToUploadQueue(item);

    }

    //item has the follow the following format
    //
    addToUploadQueue(item) {
        this.uploadQueue.enqueue(item);
        console.log("Current upload queue: " + this.uploadQueue.printQueue);
        // wait for the access token then upload
        //let me = this;
        if (this.isUploading == false) {
            //if this isUploading is true, then we are already uploading.
            //we have enqued our object, so it will get uploaded.

            this.getAccessToken().subscribe(
                accessToken => this.uploadData(accessToken)
            );
        }
        //this.uploadData();
    }

    //
    async uploadData(accessToken) {
        //[x]survey, app usage, [x]reinforcement, intervention (two one randomization, one the messages), [x] baseline survey
        console.log("upload in queue called");
        const token = accessToken;
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            })
        };

        //If fails then we save
        while (this.uploadQueue.isEmpty() == false) {
            this.isUploading = true;
            var item = this.uploadQueue.dequeue();
            let flaskServerAPIEndpoint = "https://adapts.fsm.northwestern.edu/api/upload-data.json";
            //let data = JSON.stringify(item.data);


            var payload;
            if (item.isEncrypted)
                payload = this.EncrDecr.encrypt(JSON.stringify(item.data), environment.encyptString);
            else
                payload = item.data;

            var dataEncrypted = {};
            //console.log('Encrypted survey: ' + encrypted);
            dataEncrypted['payload'] = payload;
            dataEncrypted['key'] = item.typeOfData;
            dataEncrypted['encrypted'] = item.isEncrypted;

            // this.http.post(flaskServerAPIEndpoint, dataEncrypted, httpOptions).subscribe({
            //     next: data => console.log("Upload log: " + JSON.stringify(data)),
            //     error: error => console.error('There was an error!', error)
            // });
            const firstValue = await firstValueFrom(this.http.post(flaskServerAPIEndpoint, dataEncrypted, httpOptions), { defaultValue: 0 });
            if (firstValue == 0)
                this.uploadQueue.enqueue(item);
            console.log("firstValue (" + item.typeOfData + "): " + JSON.stringify(firstValue));
            // this.http.post(flaskServerAPIEndpoint, dataEncrypted, httpOptions).subscribe({
            //     next: data => console.log("Upload log: " + JSON.stringify(data)),
            //     error: error => console.error('There was an error!', error)
            // });

        }
        this.isUploading = false;

    }


    getAccessToken(): Observable<any> {
        //we are returning the 
        console.log("uploadservice.ts - refreshToken method - begin");

        if (localStorage.ACCESS_TOKEN_EXPIRATION != undefined) {
            let currentTime = new Date();
            let currentExpiration = Date.parse(localStorage.ACCESS_TOKEN_EXPIRATION);
            console.log("Access token times: " + currentTime.toUTCString() + ", " + localStorage.ACCESS_TOKEN_EXPIRATION);
            if ((currentTime.getTime() + 0 * 60 * 60 * 1000) < currentExpiration) {
                console.log("Token not expired: " + currentTime.getTime() + ", " + currentExpiration);
                //Here I can directly, unless there is a failure.
                return of(localStorage.getItem(this.ACCESS_TOKEN));
            }
        }

        const token = this.getRefreshToken();
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
        let me = this;
        return this.http.post<any>(`${environment.userServer}/token/refresh`, {
            'refreshToken': this.getRefreshToken()
        }, httpOptions)
            .pipe(
                map(res => {
                    me.storeAccessToken(res.access_token, res.access_expires);
                    return res['access_token'];
                })
            );
        // .pipe(
        //     map(res => res['access_token'])
        // );

    }


    uploadPrivateData(unencrypted_payload){
        //we consider the payload to be unencrypted.
        //We will encrypt the payload and send it.
        this.getAccessToken().subscribe(
            accessToken => {

                // get bearer token
                const token = accessToken;
                console.log("Access token: " + accessToken);
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    })
                };

                //
                console.log("Pre-Encrypted payload" + JSON.stringify(unencrypted_payload));
                let flaskServerAPIEndpoint = "https://adapts.fsm.northwestern.edu/api/private.json";
                let payload = '"' + this.EncrDecr.encrypt(JSON.stringify(unencrypted_payload), environment.encyptString) + '"';
                console.log("Encrypted payload" + JSON.stringify(payload));
                this.http.post(flaskServerAPIEndpoint, payload, httpOptions).subscribe({
                    next: data => {
                        this.privateUploadCompleted$.next("private data uploaded");
                        console.log('Uplaod data', data)
                    },
                    error: error => console.error('There was an error!', error)
                });

                // let flaskServerAPIEndpoint2 = "https://adapts.fsm.northwestern.edu/api/userinfo";
                // unencrypted_payload['mock'] = "Mock user data";
                // let payload2 = unencrypted_payload; //this.EncrDecr.encrypt(JSON.stringify(unencrypted_payload), environment.encyptString);
                // console.log(JSON.stringify(payload));
                // this.http.post(flaskServerAPIEndpoint2, payload2, httpOptions).subscribe({
                //     next: data => console.log('Uplaod data (userinfo)', data),
                //     error: error => console.error('There was an error!', error)
                // });


            }//end of accessToken call back
        );

    }

    //getPrivateUserData(): Observable<any>{
    getPrivateUserData(): Observable<any>{

        //we consider the payload to be unencrypted.
        //We will encrypt the payload and send it.

        return this.getAccessToken().pipe(
            switchMap((accessToken) => {
                // get bearer token
                const token = accessToken;
                console.log("Access token: " + accessToken);
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    })
                };

                let flaskServerAPIEndpoint = "https://adapts.fsm.northwestern.edu/api/private.json";
                //let me = this;
                return this.http.get(flaskServerAPIEndpoint, httpOptions)
                    .pipe(
                        map(data => {
                            //me.storeAccessToken(res.access_token, res.access_expires);
                            return data;
                        })
                    );

            }),
            map((data) => this.EncrDecr.decrypt(data, environment.encyptString))
            //currently no error handling??
        );


        // this.getAccessToken().subscribe(
        //     accessToken => {

        //         // get bearer token
        //         const token = accessToken;
        //         console.log("Access token: " + accessToken);
        //         const httpOptions = {
        //             headers: new HttpHeaders({
        //                 'Authorization': `Bearer ${token}`,
        //                 'Content-Type': 'application/json'
        //             })
        //         };

        //         // var decrypted = this.EncrDecr.decrypt(locallyStoredSurvey['alex_survey_aya']["encrypted"], environment.encyptString);
        //         let flaskServerAPIEndpoint = "https://adapts.fsm.northwestern.edu/api/private.json";
        //         //return this.http.get(flaskServerAPIEndpoint, httpOptions).subscribe({
        //         this.http.get(flaskServerAPIEndpoint, httpOptions).subscribe({
        //             //next: data => console.log('Returned private data', this.EncrDecr.decrypt(data, environment.encyptString)),
        //             next: data => {
        //                 //return this.EncrDecr.decrypt(data, environment.encyptString);
        //                 console.log('Returned private data', this.EncrDecr.decrypt(data, environment.encyptString));
        //             },
        //             error: error => {
        //                 //return {'msg': "There was an error", "error": error};
        //                 console.log('There was an error',error);
        //             }
        //         });

        //         // let flaskServerAPIEndpoint2 = "https://adapts.fsm.northwestern.edu/api/userinfo";
        //         // unencrypted_payload['mock'] = "Mock user data";
        //         // let payload2 = unencrypted_payload; //this.EncrDecr.encrypt(JSON.stringify(unencrypted_payload), environment.encyptString);
        //         // console.log(JSON.stringify(payload));
        //         // this.http.post(flaskServerAPIEndpoint2, payload2, httpOptions).subscribe({
        //         //     next: data => console.log('Uplaod data (userinfo)', data),
        //         //     error: error => console.error('There was an error!', error)
        //         // });


        //     }//end of accessToken call back
        // );
    }


    // get the refresh token??
    executeCallbackFunction(callbackFunction) {

        if (localStorage.ACCESS_TOKEN_EXPIRATION != undefined) {
            let currentTime = new Date();
            let currentExpiration = Date.parse(localStorage.ACCESS_TOKEN_EXPIRATION);
            console.log("Access token times: " + currentTime.toUTCString() + ", " + localStorage.ACCESS_TOKEN_EXPIRATION);
            // console.log(typeof currentExpiration);
            // console.log(typeof currentTime);
            if ((currentTime.getTime() + 0 * 60 * 60 * 1000) < currentExpiration) {
                console.log("Token not expired: " + currentTime.getTime() + ", " + currentExpiration);
                //Here I can directly, unless there is a failure.
                callbackFunction();
            }
        }

        console.log("uploadservice.ts - refreshToken method - begin");
        const token = this.getRefreshToken();
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
        let me = this;
        this.http.post<any>(`${environment.userServer}/token/refresh`, {
            'refreshToken': this.getRefreshToken()
        }, httpOptions).subscribe(data => {
            console.log(JSON.stringify(data));
            me.storeAccessToken(data.access_token, data.access_expires);
            callbackFunction();
        });
    }

    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
    public getRefreshToken() {
        console.log("uploadservice.ts  - getRefreshToken method - begin " + localStorage.getItem(this.REFRESH_TOKEN));
        return localStorage.getItem(this.REFRESH_TOKEN);
    }

    private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
    private storeAccessToken(token: string, expires: string) {
        console.log("uploadservice.ts - storeAccessToken method - begin");
        localStorage.setItem(this.ACCESS_TOKEN, token);
        let h = parseInt(expires.split(":")[0]);
        const expirationDate = new Date(new Date().getTime() + (h * 60 * 60 * 1000)); //which data the token will expire.
        localStorage.ACCESS_TOKEN_EXPIRATION = expirationDate;

        //
        console.log("Access token: " + token);
        console.log("Access token expiration: " + expirationDate);

        // this.loadTailoredMessage();
    }


    //in this service we will manage both syncing private
    //and non-private data with local storage;
    



    // ToDo: see when the refresh token will go away??

    // once refresh token is 
    // found upload 
    // Input should be location, and payload
    // payload type.
}
