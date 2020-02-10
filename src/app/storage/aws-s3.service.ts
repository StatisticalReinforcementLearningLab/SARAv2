
//
//--- The goal of this file is to upload a file to AWS S3, the configuration
//--- is at app/environments/environment.ts. 

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as AWS from 'aws-sdk';
import { StoreBaseService } from './storage-base.service';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service extends StoreBaseService {
  currentFile: File;

  constructor() { 
    super();
  }

  upload(subfolder, result){
    var bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;    
    
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
      params: {Bucket: bucketName},
    });  

    //create a file from result passed as a JSONObject
    var fileName = "result"+new Date().getTime()+".json";
    this.currentFile = new File([JSON.stringify(result)], fileName, {type: "text/plain"});

    //upload currentFile to the subfolder in S3 bucket
    s3.upload({
      Bucket: bucketName,
      Key: subfolder+"/"+fileName,    
      Body: this.currentFile,
    }, function(err, data) {
      if (err) {
         console.log('There was an error uploading your file: '+err.message);
      }
      console.log('Successfully uploaded file: '+fileName);
    });  
  }

}
