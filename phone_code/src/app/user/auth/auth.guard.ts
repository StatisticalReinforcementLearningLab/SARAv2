import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean| UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    
    //This using reactive programming
    //--- pipe: is a series of operation to be executed when the observables "loggedInUser" state changes
    //--- take: an observable can emit a series of values. take(1) means only the first value will be used
    //--- map: function takes an observable, do some transformation and returns a observable.
    //--- search documentation here: https://rxjs-dev.firebaseapp.com/
    
    return this.authService.loggedInUser.pipe(take(1),map(loggedInUser => {
      const isAuth = !!loggedInUser;
      if(isAuth){
        console.log("auth.guard.ts - (isAuth): true");
        return true;
      } else {
        console.log("auth.guard.ts - (isAuth): false");
        return this.router.createUrlTree(['auth']);
      }
    }));
  }
}
