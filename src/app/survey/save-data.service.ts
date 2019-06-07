import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  constructor() { }

  saveData(key, obj){
    localStorage.setItem(key, obj);
  }
}
