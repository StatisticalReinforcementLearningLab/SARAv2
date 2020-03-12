//this component will register/login a user

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserProfileService } from '../user-profile/user-profile.service';
import { tap } from 'rxjs/operators';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({  
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private userSub: Subscription;
  private authSub: Subscription;

  constructor(private authService: AuthService, 
    private router: Router,
    private userProfileService: UserProfileService,
    private oneSignal: OneSignal){}

  // was used to switch mode between login and register
  // onSwitchMode(){
  //   this.isLoginMode = !this.isLoginMode;
  // }

  ngOnInit(){
    console.log(environment.userServer);
  }

  //login button was clicked
  onSubmit(form: NgForm){
    console.log("auth.component.ts - onSubmit method - begin");

    if(!form.valid){
      console.log('invalid');
      return;
    }
    const userName = form.value.userName;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    // if(this.isLoginMode){

    // login returns an observable
    authObs =  this.authService.login(userName,password);
    // }else{
    //   authObs =  this.authService.signup(userName, password);
    // }

    this.authSub = authObs.subscribe(resData => {
      console.log("auth.component.ts - onSubmit method - authService.login response: "+ JSON.stringify(resData));
      
      if(resData.hasOwnProperty('access_token') && resData.hasOwnProperty('refresh_token') ){
        // the response contains an access token and refresh token
        console.log("auth.component.ts - onSubmit method - has access token");
        
        // userProfileService.initializeObs returns an observable, 
        // then below we can get the OneSignal Player id when UserProfile has been intialized 
        this.userSub = this.userProfileService.initializeObs()
        .pipe(
          tap(
              ()=>{
                this.oneSignal.getIds().then(async (id) =>  {
                  const playerId = id.userId;
                  this.userProfileService.userProfile.oneSignalPlayerId = id.userId;
                  console.log("onesignal player id: " + id);
                  this.userProfileService.saveProfileToDevice();
                  this.userProfileService.saveToServer();
                });
              }
          )
        )
        .subscribe(
          ()=>
          {
            this.router.navigateByUrl('/home');
            this.isLoading = false;
          }        
        );      
      }
      else
      {
        this.isLoading = false;
        this.authService.loggedInUser.next(null);
        if(resData.hasOwnProperty('message')){
          this.error = resData.message;
        }
        else{
          this.error = "Unknown error\n" + JSON.stringify(resData);
        }
      }
      // console.log(resData);
    }, errorMessage=> {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });
    form.reset();
  }


  ngOnDestroy(){
    if(this.userSub){
      this.userSub.unsubscribe();
    }
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }
}
