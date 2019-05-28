import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreToFirebaseService } from './store-to-firebase.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ StoreToFirebaseService ]
})
export class StorageModule { }
