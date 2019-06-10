import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class StoreToFirebaseService {

  constructor(
    private afs: AngularFirestore
  ) { 
  }

  /*initFirebase(){
    // TODO: Replace the following with your app's Firebase project configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBK_PwjnsC01Q-a-sV7LsA7qIeIhCx4ts0",
      authDomain: "sarav2-6a033.firebaseapp.com",
      databaseURL: "https://sarav2-6a033.firebaseio.com",
      projectId: "sarav2-6a033",
      storageBucket: "sarav2-6a033.appspot.com",
      messagingSenderId: "489827689493",
      appId: "1:489827689493:web:7f72eb7033e9acf5"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("firebase.initializeApp");

  }

  storeTofirebase(surveyResult){
    console.log("Inside storeTofirebase");

    var db = firebase.firestore();
    console.log("firestore database created");
 
    console.log("firestore created");
    db.collection("test").add(surveyResult)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    console.log("saved to firestore");
  
       // Get a key for a new Post.
      //var newPostKey = firebase.database().ref().child('posts').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      //var updates = {};
      //updates['/posts/' + newPostKey] = surveyResult;
    
      //return firebase.database().ref().update(updates);
      
  }*/

    addSurvey(path, obj: object){
      console.log("Start to addSurvey!");
      return new Promise<any>((resolve, reject) => {
        this.afs.collection(path).add(obj)
        .then(
          (res) => {
            resolve(res)
          },
          err => reject(err)
        )
      }) 
    }    

}
