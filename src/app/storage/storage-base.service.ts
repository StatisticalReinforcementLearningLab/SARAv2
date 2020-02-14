//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class StoreBaseService {

    constructor() { 
    }
}

  