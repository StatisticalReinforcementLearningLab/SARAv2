import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean| UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    return this.authService.loggedInUser.pipe(take(1),map(loggedInUser => {
      const isAuth = !!loggedInUser;
      if(isAuth){
        return true;
      } else {
        return this.router.createUrlTree(['auth']);
      }
    }));
  }
}
