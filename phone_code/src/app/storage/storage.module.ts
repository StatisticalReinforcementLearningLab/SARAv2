import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { EncrDecrService } from './encrdecrservice.service';
import { AwsS3Service } from './aws-s3.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { UploadserviceService } from './uploadservice.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ EncrDecrService, AwsS3Service, UploadserviceService, Network]
})
export class StorageModule { }
