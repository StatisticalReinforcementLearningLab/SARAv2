import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  constructor(   
    private router: Router
    ) { }

  saveData(key, obj){
    localStorage.setItem(key, obj);
  }

  browseToReward(){
      this.router.navigateByUrl('/incentive/award');
  }
}
