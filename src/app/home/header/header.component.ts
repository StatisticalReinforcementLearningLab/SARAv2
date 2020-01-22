import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/user/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(private authService: AuthService, 
              private router: Router) { }
   
  
  // onTestButtonClicked(){
  //   this.userProfileService.initialize();
  //   this.userProfileService.saveToServer();
  //   }

    onLogout(){
      this.authService.logout();
      this.router.navigate(['/auth']);
    }

    ngOnInit(){
      this.userSub=  this.authService.loggedInUser.subscribe(loggedInUser => {
        this.isAuthenticated = this.authService.isLoggedIn();
        console.log(!loggedInUser);
      });
      this.authService.autoLogin();
    }

    ngOnDestroy(){
      this.userSub.unsubscribe();
    }

    get userName(){
      return this.authService.loggedInUser.getValue();
    }
}
