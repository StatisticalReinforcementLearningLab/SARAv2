import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/monitor/database.service';
import * as Forge from 'node-forge';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { EncrDecrService } from 'src/app/storage/encrdecrservice.service';

@Component({
  selector: 'app-sleep-monitoring',
  templateUrl: './sleep-monitoring.component.html',
  styleUrls: ['./sleep-monitoring.component.css']
})
export class SleepMonitoringComponent implements OnInit {

  imageToShow: any;
  whichImage;
  whichImage2
  isImageLoading;
  stateDescription: string;
  supportMessages: string;

  publicKey: string;

  constructor(private menuCtrl:MenuController,
    private appUsageDb: DatabaseService,
    private userProfileService: UserProfileService,
    private EncrDecr: EncrDecrService,
    private httpClient: HttpClient) { 
      
  }

  

  ngOnInit() {
    this.menuCtrl.close();
    this.publicKey = environment.publicKey;
    this.whichImage = environment.flaskServerForSleepSelfMonitoringGraphs + "/sleep_graph.png";
    this.isImageLoading = false;
    this.stateDescription = "Loading....";
    this.supportMessages = "Loading....";
    this.getImageFromService();
    this.getSupportMessageFromService();
  }

  getSupportMessageFromService() {
    /*
       getSupportMessageFromService function get support message based on user's sleep
       and survey adherence patterns for the last 14 days. 

       This accomplishes this with a micro-service running on the ec2 server. 
       The micro-service is located in "SARATemplate/apis/sleep_monitoring_messages"

       The post request to the microservice inputs the username, and optionally  
       sleep data for the current if it available.
    */

    var requestDataJson = {"user_id": this.userProfileService.username};
    requestDataJson = this.addTodaysSleepDataIfAvailable(requestDataJson);

    var flaskServerAPIEndpoint = environment.flaskServerForSleepSelfMonitoringMessage;
    this.httpClient.post(flaskServerAPIEndpoint + '/sleep_messages', requestDataJson).subscribe({
        next: data => {
          // console.log(JSON.stringify(data));
          this.stateDescription = data["state_description"];
          this.supportMessages = JSON.stringify(data["support_messages"]);
        },
        error: error => console.error('There was an error!', error)
    });
    
  }

  encryptWithPublicKey(valueToEncrypt: string): string {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    var encrypted = rsa.encrypt(valueToEncrypt, "RSA-OAEP", {
                        md: Forge.md.sha256.create()
                    });
    // console.log("Encrypted (btoa): " + window.btoa(encrypted));
    // console.log("Encrypted (forge): " + Forge.util.encode64(encrypted));
    return window.btoa(encrypted);
  }

  ionViewDidEnter(){
    this.appUsageDb.saveAppUsageEnter("sleep_self_monitoring");  
  }  

  ionViewDidLeave(){
    this.appUsageDb.saveAppUsageExit("sleep_self_monitoring");     
  }

  getImage(imageUrl: string): Observable<Blob> {

    /*
       getImage function get sleep monitoring graph message based on user's sleep
       and survey adherence patterns for the last 14 days. 

       This accomplishes this with a micro-service running on the ec2 server. 
       The micro-service is located in "SARATemplate/apis/sleep_self_monitoring"

       The post request to the microservice inputs the username, and optionally  
       sleep data for the current if it available. These inputs are supplied as
       a RSA 2048 encrypted string. The public key for the encryption is in 
       the environment file. The private key will be stored in the serve
       micro-service. 
    */


    // reference
    // Http client
    //    https://www.tektutorialshub.com/angular/angular-http-get-example-using-httpclient/
    // RSA examples in Forge:
    //    https://medium.com/@DannyAziz97/rsa-encryption-with-js-python-7e031cbb66bb
    //    https://github.com/digitalbazaar/forge/blob/master/README.md#rsa

    //let requestDataJson = {"user_id": this.userProfileService.username, "sleep_data": {"report_date": "20210907", "start": "1:30", "end": "07:30"}}
    var requestDataJson = {"user_id": this.userProfileService.username};
    requestDataJson = this.addTodaysSleepDataIfAvailable(requestDataJson);
    let requestData2 = this.encryptWithPublicKey(JSON.stringify(requestDataJson));
    console.log("Encrypted: " + requestData2)
    console.log("Encrypted (encoded): " + encodeURIComponent(requestData2))

    const headers = new HttpHeaders().set('Content-Type', "text/plain");
    let params = new HttpParams().set("raw", encodeURIComponent(requestData2)).set("time", Date.now().toString());

    //let params2 = new HttpParams().set("requestData", encodeURIComponent('{"test":"holla"}'))
    return this.httpClient.get(imageUrl, { responseType: 'blob', 'headers': headers, 'params': params});
  }

  addTodaysSleepDataIfAvailable(requestDataJson) {
    /*
    If sleep data is available for today, then add is to the request
    Otherwise, return the same object
    */

    if (window.localStorage['localSurvey'] != undefined){
        let locallyStoredSurvey = JSON.parse(window.localStorage.getItem('localSurvey'));
        if (locallyStoredSurvey.hasOwnProperty('sleep_survey')) {
          if(locallyStoredSurvey['sleep_survey']["date"] == moment().format('YYYYMMDD')){
            //decrypt the data and add to the requestDataJson
            var decrypted = this.EncrDecr.decrypt(locallyStoredSurvey['sleep_survey']["encrypted"], environment.encyptString);
            let decryptedSleepSurvey = JSON.parse(decrypted);
            // console.log("decryptedSleepSurvey: " + decrypted);

            //"sleep_data": {"report_date": "20210907", "start": "1:30", "end": "07:30"}
            var todaysSleepData = {}
            todaysSleepData["report_date"] = moment().format('YYYYMMDD');
            todaysSleepData["start"] = decryptedSleepSurvey["Q2_modified"].split(" ")[0];
            todaysSleepData["end"] = decryptedSleepSurvey["Q3_modified"].split(" ")[0];
            requestDataJson["sleep_data"] = todaysSleepData;
          } 
        }
    }
    console.log("requestDataJson: " + JSON.stringify(requestDataJson));
    return requestDataJson;
  }

  createImageFromBlob(image: Blob) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
      }, false);
  
      if (image) {
        reader.readAsDataURL(image);
      }
  }

  getImageFromService() {
    this.isImageLoading = true;
    this.getImage(this.whichImage).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.log(error);
  });

  
}

}
