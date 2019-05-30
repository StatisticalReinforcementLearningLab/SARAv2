import { Injectable } from '@angular/core';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
//import { StorageModule } from '../storage/storage.module';

@Injectable({
  providedIn: 'root',
})
export class StoreToFirebaseService {

  constructor() { 
  }

  initFirebase(){
    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDlTFW_FVZQJxm_IBZwlIvWaTwBysN2Wrs",
      authDomain: "sarav2.firebaseapp.com",
      databaseURL: "https://sarav2.firebaseio.com",
      projectId: "sarav2",
      storageBucket: "sarav2.appspot.com",
      messagingSenderId: "899903481432",
      appId: "1:899903481432:web:fd409012bf1966ce"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("firebase.initializeApp");

  }

  storeTofirebase(surveyResult){
    console.log("Inside storeTofirebase");

    /*var db = firebase.firestore();

    console.log("firestore created");
    db.collection("test").add(surveyResult)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    console.log("saved to firestore");*/
  
    var database = firebase.database();
    console.log("firestore database created");
    database.ref('result').set(surveyResult);

       // Get a key for a new Post.
      //var newPostKey = firebase.database().ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      //var updates = {};
      //updates['/posts/' + newPostKey] = surveyResult;
    
      //return firebase.database().ref().update(updates);
      
    }
}
