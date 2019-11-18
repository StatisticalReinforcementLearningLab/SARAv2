// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyBK_PwjnsC01Q-a-sV7LsA7qIeIhCx4ts0",
    authDomain: "sarav2-6a033.firebaseapp.com",
    databaseURL: "https://sarav2-6a033.firebaseio.com",
    projectId: "sarav2-6a033",
    storageBucket: "sarav2-6a033.appspot.com",
    messagingSenderId: "489827689493",
    appId: "1:489827689493:web:7f72eb7033e9acf5"
  },

  azureConfig: {
    sas: '?sv=2018-03-28&ss=b&srt=sco&sp=rwl&st=2019-06-27T18%3A15%3A56Z&se=2020-06-28T18%3A15%3A00Z&sig=vccYOEN3SG%2BErA4%2FzmDNn0w4qOn%2FT4tB8jGnEIJoXh4%3D',
    storageAccount: 'securebloblyh',
    containerName: 'mycontainer'  
  },

  awsConfig: {
    bucketName: 'sara-testv',
    bucketRegion:'us-east-2',
    IdentityPoolId: 'us-east-2:c9617754-1d3e-4058-bfa4-d54230cb72cf',
    accessKeyId: 'AKIA5U5F73RGDIYD6DUQ',
    secretAccessKey: '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'
 
  },

  googleAnalytic: {
    id: 'UA-152399644-1' 
  }


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
