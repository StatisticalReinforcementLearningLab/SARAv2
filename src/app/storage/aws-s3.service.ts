import { Injectable } from '@angular/core';
import { environment } from '../../environments/enivornment';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {
  currentFile: File;

  constructor() { }

  upload(result){
    var bucketName =  environment.awsConfig.bucketName;
    var bucketRegion = environment.awsConfig.bucketRegion;
    var IdentityPoolId = environment.awsConfig.IdentityPoolId;
    var accessKeyId = environment.awsConfig.accessKeyId;
    var secretAccessKey = environment.awsConfig.secretAccessKey;
    
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName},
      //accessKeyId: accessKeyId,
      //secretAccessKey: secretAccessKey
    });  

    this.currentFile = new File([JSON.stringify(result)], "result.json", {type: "text/plain"});

    s3.upload({
      Bucket: bucketName,
      Key: this.currentFile.name,
      Body: this.currentFile,
      ACL: 'public-read'
    }, function(err, data) {
      if (err) {
        //return alert('There was an error uploading your photo: '+err.message);
        console.log('There was an error uploading your file: '+err.message);
      }
      console.log('Successfully uploaded photo.');
    });  
  }

}
