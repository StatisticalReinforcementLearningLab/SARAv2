//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from './encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service extends StoreBaseService {
  currentFile: File;
  bucketName;
  s3;
  subfolder;

  constructor(
    private networkSvc: NetworkService,
    private EncrDecr: EncrDecrService) { 
    super();
  }

  upload(subfolder, result){
    this.bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;
    //var accessKeyId = environment.awsConfig.accessKeyId;
    //var secretAccessKey = environment.awsConfig.secretAccessKey;

    //set properties after creating AWS.Config using the update method
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    //creates a new Amazon S3 service object
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: this.bucketName}
    });  

    /*const myS3Credentials = {
      accessKeyId: accessKeyId,
      secretAcccessKey: secretAccessKey,
    };
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName},
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    });  */

    //create a file from result passed as a JSONObject
    var fileName = "result_" + (new Date().getTime()) + "_" + this.EncrDecr.getSHA256(localStorage.getItem('loggedInUser')) + ".json";
    this.currentFile = new File([JSON.stringify(result)], fileName, {type: "text/plain"});
    //upload currentFile to the subfolder in S3 bucket
    this.STORAGE_REQ_KEY = subfolder+"_result";
    this.subfolder = subfolder;
    if(this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online){
      if(window.localStorage.getItem(this.STORAGE_REQ_KEY) != undefined ) 
        this.uploadLocalData();
      this.uploadToS3(subfolder+"/"+fileName, result).catch(err => {
        if (err ) {
          console.log('Caught thrown error: '+err.message);
          this.storeResultLocally(result); 
        }
      });     
    } else {
      this.storeResultLocally(result);
    }
  }

  async uploadToS3(key, result) {
    this.s3.upload({
      Bucket: this.bucketName,
      Key: key,
      Body: JSON.stringify(result)  
      //Body: this.currentFile
    }, function(err, data) {
      if (err) {
        console.log('There was an error uploading your file: '+err.message);
        throw new Error(err.message);
      } 
   });

  }

  //upload local data
  uploadLocalData() {   
    var storedObj = this.getLocalData();
    this.clearLocalData();
    if (storedObj.length > 0) {
      for (let op of storedObj) {
        console.log(JSON.stringify(op));
        var fileName = "result_" + (new Date().getTime()) + "_" + this.EncrDecr.getSHA256(localStorage.getItem('loggedInUser')) + ".json";
        this.uploadToS3(this.subfolder+"/"+fileName, [op.data]).catch(err => {
          if (err ) {
            console.log('Caught thrown error: '+err.message);
            this.saveJsonObjLocally(op); 
          }
          console.log('In uploadLocalData: update file successfully');
        });     
      }  
    } 
  }

}
