//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from './encrdecrservice.service';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service extends StoreBaseService {
  currentFile: File;

  constructor(private EncrDecr: EncrDecrService) { 
    super();
  }

  upload(subfolder, result){
    var bucketName =  environment.awsConfig.bucketName;
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
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName}
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
    s3.upload({
      Bucket: bucketName,
      Key: subfolder+"/"+fileName,    
      Body: this.currentFile
    }, function(err, data) {
      if (err) {
        console.log('There was an error uploading your file: '+err.message);
      }
      console.log('Successfully uploaded file: '+fileName);
    });  
  }

}
