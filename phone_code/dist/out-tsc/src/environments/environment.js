// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export var environment = {
    production: false,
    userServer: "http://adaptsdata.research.chop.edu:5000",
    oneSignalAppId: "f9c4370d-cbcb-4e6f-ab1f-25d1c41b8f3a",
    encyptString: "+Xr?SwA?EJ7m+g$c",
    firebaseConfig: {
        apiKey: "AIzaSyBK_PwjnsC01Q-a-sV7LsA7qIeIhCx4ts0",
        authDomain: "sarav2-6a033.firebaseapp.com",
        databaseURL: "https://sarav2-6a033.firebaseio.com",
        projectId: "sarav2-6a033",
        storageBucket: "sarav2-6a033.appspot.com",
        messagingSenderId: "110945766941",
        appId: "1:489827689493:web:7f72eb7033e9acf5"
    },
    azureConfig: {
        sas: '?sv=2018-03-28&ss=b&srt=sco&sp=rwl&st=2019-06-27T18%3A15%3A56Z&se=2020-06-28T18%3A15%3A00Z&sig=vccYOEN3SG%2BErA4%2FzmDNn0w4qOn%2FT4tB8jGnEIJoXh4%3D',
        storageAccount: 'securebloblyh',
        containerName: 'mycontainer'
    },
    awsConfig: {
        // CHOP
        bucketName: 'chop-sara',
        bucketRegion: 'us-east-1',
        IdentityPoolId: 'us-east-1:667b1ad5-ccdc-4d90-b94f-300732b55448'
    },
    googleAnalytic: {
        id: 'UA-152399644-1'
    }
};
// export const environment = {
//   production: false,
//   userServer:"http://autherServerName.com",
//   oneSignalAppId: "<insert Id here>",
//   firebase: {
//     apiKey: "AIzaSyDM8d1yG2rNPc8AotB0NoN3Q2wMq4HDooo",
//     authDomain: "adapts-331ee.firebaseapp.com",
//     databaseURL: "https://adapts-331ee.firebaseio.com",
//     projectId: "adapts-331ee",
//     storageBucket: "adapts-331ee.appspot.com",
//     messagingSenderId: "110945766941",
//     appId: "1:110945766941:web:7c940aefa53553c39bc0f4",
//     measurementId: "G-TL8MFZNE2M"
//     // apiKey: "AIzaSyBK_PwjnsC01Q-a-sV7LsA7qIeIhCx4ts0",
//     // authDomain: "sarav2-6a033.firebaseapp.com",
//     // databaseURL: "https://sarav2-6a033.firebaseio.com",
//     // projectId: "sarav2-6a033",
//     // storageBucket: "sarav2-6a033.appspot.com",
//     // messagingSenderId: "489827689493",
//     // appId: "1:489827689493:web:7f72eb7033e9acf5"
//   },
//   firebaseConfig: {
//         // apiKey: "AIzaSyBK_PwjnsC01Q-a-sV7LsA7qIeIhCx4ts0",
//     // authDomain: "sarav2-6a033.firebaseapp.com",
//     // databaseURL: "https://sarav2-6a033.firebaseio.com",
//     // projectId: "sarav2-6a033",
//     // storageBucket: "sarav2-6a033.appspot.com",
//      messagingSenderId: "489827689493",
//     // appId: "1:489827689493:web:7f72eb7033e9acf5"
//   }
// };
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
//# sourceMappingURL=environment.js.map