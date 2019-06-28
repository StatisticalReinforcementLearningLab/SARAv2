import { Injectable } from '@angular/core';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'

//angular-azure-blob-service
const Config: UploadParams = {
  sas: '?sv=2018-03-28&ss=b&srt=sco&sp=rwl&st=2019-06-27T18%3A15%3A56Z&se=2020-06-28T18%3A15%3A00Z&sig=vccYOEN3SG%2BErA4%2FzmDNn0w4qOn%2FT4tB8jGnEIJoXh4%3D',
  storageAccount: 'securebloblyh',
  containerName: 'mycontainer'
};

@Injectable({
  providedIn: 'root'
})


export class AzureService {
  currentFile: File;
  config: UploadConfig;
  private percent: number;

  constructor(    
    private blobsvc: BlobService
  ) { }

  upload (result) {
    //var fileDir = cordova.file.externalDataDirectory; 
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
