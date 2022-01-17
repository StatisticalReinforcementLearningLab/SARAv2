import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserProfileService } from './user-profile/user-profile.service';
import { UserProfile } from './user-profile/user-profile.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { LoadingSpinnerComponent } from './auth/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [AuthComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
    
  ],
  exports: [AuthComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
    // , UserProfile
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule { }

export { UserProfile } from './user-profile/user-profile.model';
