import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { LoadingSpinnerComponent } from './auth/loading-spinner/loading-spinner.component';
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = tslib_1.__decorate([
        NgModule({
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
    ], UserModule);
    return UserModule;
}());
export { UserModule };
export { UserProfile } from './user-profile/user-profile.model';
//# sourceMappingURL=user.module.js.map