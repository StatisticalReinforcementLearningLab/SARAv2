import { Injectable } from '@angular/core';

import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class AwsS3Service {
  currentFile: File;

  constructor() { }

  upload(result){
    var bucketName = 'sara-testv';
    var bucketRegion = 'us-east-2';
    var IdentityPoolId = 'us-east-2:c9617754-1d3e-4058-bfa4-d54230cb72cf';
    
    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });
    
    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: bucketName}
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
        console.log('There was an error uploading your photo: '+err.message);
      }
      console.log('Successfully uploaded photo.');
    });  
  }

}
