import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/app/monitor/database.service';
import * as Forge from 'node-forge';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { environment } from 'src/environments/environment';

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

  publicKey: string;

  constructor(private menuCtrl:MenuController,
    private appUsageDb: DatabaseService,
    private userProfileService: UserProfileService,
    private httpClient: HttpClient) { 

  }

  

  ngOnInit() {
    this.menuCtrl.close();
    this.publicKey = environment.publicKey;
    this.whichImage = "http://ec2-3-223-25-230.compute-1.amazonaws.com:56734/sleep_graph.png";
    this.isImageLoading = false;
    this.getImageFromService();
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
    // reference
    // Http client
    //    https://www.tektutorialshub.com/angular/angular-http-get-example-using-httpclient/
    // RSA examples in Forge:
    //    https://medium.com/@DannyAziz97/rsa-encryption-with-js-python-7e031cbb66bb
    //    https://github.com/digitalbazaar/forge/blob/master/README.md#rsa
    let requestDataJson = {"user_id": this.userProfileService.username, "sleep_data": {"report_date": "20210901", "start": "1:30", "end": "08:00"}}
    let requestData2 = this.encryptWithPublicKey(JSON.stringify(requestDataJson));
    // console.log("Encrypted: " + requestData2)
    // console.log("Encrypted (encoded): " + encodeURIComponent(requestData2))
    
    const headers = new HttpHeaders().set('Content-Type', "text/plain");
    let params = new HttpParams().set("raw", encodeURIComponent(requestData2)).set("time", Date.now().toString());

    //let params2 = new HttpParams().set("requestData", encodeURIComponent('{"test":"holla"}'))
    return this.httpClient.get(imageUrl, { responseType: 'blob', 'headers': headers, 'params': params});
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
