import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponent implements OnInit {
  agreeToTerms: boolean = JSON.parse(localStorage.getItem("agreeToTerms"));

  constructor() { }

  ngOnInit() {}

  onSubmit(){
    localStorage.setItem("agreeToTerms",this.agreeToTerms.toString());
    location.reload();
  }
}
