//
//--- The goal of this file is to upload an object to firebase, the configuration
//--- is at app/environments/environment.ts. At app/storage/storage.module.ts, 
//--- we load the environment configuration and setup our module to use the 
//--- AngularFire package 

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreBaseService } from './storage-base.service';


@Injectable({
  providedIn: 'root',
})
export class StoreToFirebaseService extends StoreBaseService {

  constructor(
    private afs: AngularFirestore
  ) { 
    super();
  }

  //upload obj to path in firebase
  addSurvey(path, obj: object){
    console.log("Start to addSurvey!");
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(path).add(obj)
      .then(
        (res) => {
          resolve(res)
        },
        err => reject(err)
      )
    }) 
  }    

}
