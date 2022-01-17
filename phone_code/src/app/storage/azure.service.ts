//
//--- The goal of this file is to upload a file to Azure, the configuration
//--- is at app/environments/environment.ts. 

import { Injectable } from '@angular/core';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';

// Get configuration
const Config: UploadParams = {
  sas: environment.azureConfig.sas,
  storageAccount:  environment.azureConfig.storageAccount,
  containerName: environment.azureConfig.containerName
};

@Injectable({
  providedIn: 'root'
})


export class AzureService extends StoreBaseService {
  currentFile: File;
  config: UploadConfig;
  private percent: number;

  constructor(    
    private blobsvc: BlobService
  ) { 
    super();
  }

  upload (result) {
    
    //create a file from result passed as a JSONObject
    this.currentFile = new File([JSON.stringify(result)], "result-Azure.json", {type: "text/plain"});
      const baseUrl = this.blobsvc.generateBlobUrl(Config, this.currentFile.name);
      this.config = {
        baseUrl: baseUrl,
        sasToken: Config.sas,
        blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
        file: this.currentFile,
        complete: () => {
          console.log('Transfer completed !');
        },
        error: (err) => {
          console.log('Error:', err);
        },
        progress: (percent) => {
          this.percent = percent;
        }
      };
      this.blobsvc.upload(this.config);
  }
}
