import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { EncrDecrService } from './encrdecrservice.service';
import { AwsS3Service } from './aws-s3.service';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ EncrDecrService, AwsS3Service, Network]
})
export class StorageModule { }
