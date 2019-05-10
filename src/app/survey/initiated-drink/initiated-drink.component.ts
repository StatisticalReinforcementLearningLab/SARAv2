import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-initiated-drink',
  templateUrl: './initiated-drink.component.html',
  styleUrls: ['./initiated-drink.component.scss'],
})
export class InitiatedDrinkComponent implements OnInit {
  //response: any; 

  constructor(private httpClient: HttpClient
    ) { }

  ngOnInit() {}

  loadJson(){
    //let obs = this.httpClient.get('assets/data/data.json');
    //obs.suscribe((response) => {
    //  this.response = response;
    // console.log(response);
    //});

  }

}
