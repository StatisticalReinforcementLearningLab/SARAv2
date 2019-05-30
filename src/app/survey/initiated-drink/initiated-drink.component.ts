import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { StoreToFirebaseService } from '../../storage/store-to-firebase.service';

declare var cordova: any;

@Component({
  selector: 'app-initiated-drink',
  templateUrl: './initiated-drink.component.html',
  styleUrls: ['./initiated-drink.component.scss'],
})
export class InitiatedDrinkComponent implements OnInit {
  //response: any; 

  private isSelectedYes : boolean; 
  private isSelectedNo : boolean; 


  constructor(
    private httpClient: HttpClient,
    private file: File,
    private storeToFirebaseService: StoreToFirebaseService
    ) { }

  ngOnInit() {}

  loadJson(){
    //let obs = this.httpClient.get('assets/data/data.json');
    //obs.suscribe((response) => {
    //  this.response = response;
    // console.log(response);
    //});

  }

  storeData(){
    console.log("Inside storeData");
    var surveyResult = {
      ID: "Q1",
      Result1: this.isSelectedYes,
      Result2: this.isSelectedNo};  
    //var jsonString = JSON.stringify(surveyResult);
    //var fileDir = cordova.file.externalApplicationStorageDirectory; 
    //var filename = "result.json";
    //var file = new File([jsonString], fileDir+filename, {type: "text/plain;charset=utf-8"});
    //this.file.writeFile(fileDir, filename, jsonString, {replace: true}) ; 
    //this.file.readAsArrayBuffer(fileDir, filename).then(async(buffer) => {
    //  await this.upload(buffer, filename);
    //});
    
    this.storeToFirebaseService.initFirebase();
    this.storeToFirebaseService.storeTofirebase(surveyResult);
  }

}
