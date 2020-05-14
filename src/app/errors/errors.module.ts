import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { ErrorsHandler } from './errors-handler.service';
import { ServerErrorsInterceptor } from './server-errors.interceptor/server-errors.interceptor'; 
//import { FormsModule } from '@angular/forms';
import { ErrorsComponentComponent } from './errors-component/errors-component.component';
import { NotificationService } from './notification.service';
import { HttpService } from './http.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

const routes: Routes = [
    { path: 'error', component: ErrorsComponentComponent },  
  ]
  
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    ErrorsComponentComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    NotificationService,
    EmailComposer,
    HttpService
  ],
  declarations: [ErrorsComponentComponent]
})
export class ErrorsModule { }
