import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as moment from 'moment';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
import { UnlockedIncentives } from '../model/unlocked-incentives';

@Injectable({
  providedIn: 'root'
})
export class AwardDollarService {

  //userProfileService: UserProfileService;;

  constructor(private userProfileService: UserProfileService, private store: Store<UnlockecIncentiveState>) { 
    //this.userProfileService = userProfileService2;
  }

  async getDollars(){
    unlockedIncentives = await this.store.pipe(select(state => state.unlockedIncentives)).toPromise();
    return calcDollars(unlockedIncentives);
  }

  calcDollars(unlockedIncentives: UnlockedIncentives){
    if(!unlockedIncentives || Object.keys(unlockedIncentive).length == 0){
      return 0;
    }
    dollarsAwarded = 1; //Start by awarding one dollar for completing the first survey.
    dates = Object.values(unlockedIncentive).sort().map(x => moment(x, "YYYYMMDD"));
    streak = 0;
    for(i=1; i < dates.length; i++){
      if(moment.duration(dates[i].diff(dates[i-1])).abs().days() == 1) {
        streak += 1;
      }
      if(streak == 2){
        streak = 0;
        dollarsAwarded += 1;
      }
    }
    return dollarsAwarded;
  }
}
