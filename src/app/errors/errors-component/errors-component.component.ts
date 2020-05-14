import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-errors-component',
  templateUrl: './errors-component.component.html',
  styleUrls: ['./errors-component.component.css']
})
export class ErrorsComponentComponent implements OnInit {
  routeParams;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private emailComposer: EmailComposer
  ) { }

  ngOnInit() {
    this.routeParams = this.activatedRoute.snapshot.queryParams;
  }

  reportError(){
    this.emailErrorMsg();
    delete this.routeParams.pos;
    this.router.navigate(['home'])
  }

  emailErrorMsg() {
    let email = {
      to: environment.emailAddress,
      subject: 'Report Error',
      body: this.routeParams.error,
      isHtml: true
    }
    this.emailComposer.open(email);
  }
}
