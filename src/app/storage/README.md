<p>This tutorial describes a step-by-step instruction to store Json files to AWS S3 using the `storage
module` in SARA.</p>


### Pre-requisites
This tutorial uses Typescript, Angular 2+, Angular services, Ionic v4.

> <em> If you are unfamiliar with these technologies, don’t worry. Typescript is the object oriented version of
Javascript. Angular a framework written in Typescript and it provides additional
functionality to easily develop web and mobile applications. Angular is also a
popular framework to develop single-page applications.
So, if you are new to Angular, learning Angular is an excellent investment. 

> Furthermore, Angular is
great to create next-generation human-centered-data-science applications, especially
just-in-time-adaptive interventions which requires direct human interaction with
intervention learn/adapt policies to deliver optimal interventions.</em>


#### Step 0:
Please make sure you have Ionic and its dependencies installed. The official website 
of Ionic has an excellent tutorial on how to install ionic and its dependencies 
(https://ionicframework.com/docs/installation/cli). 

#### Step 1:
Create a new Ionic application in command prompt(window) or Terminal (Mac) and open 
the application in the browser using the following commands.

>`ionic start SARA_aws_tutorial blank`<br>
`cd SARA_aws_tutorial`<br>
`ionic serve`<br>

If you have successfully completed the above steps, then you will be able to see the following screen:

![image](https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/SARAv2/harvard/dev/src/app/storage/Picture1.png)

#### Step 2:
Open the terminal and navigate to the project folder and install below dependency to the project:
> `npm install @types/node`<br>
> `npm install aws-sdk`

Open polyfills.ts, add below at the end:
> `// aws-sdk requires global to exist`<br>
> `(window as any).global = window;`

Open tsconfig.app.json, add `nodes` to `types` in compilerOptions block:
> `"types": ["node"]`


#### Step 3:
Configure AWS services and create bucket, refer to the first part of this link:
https://medium.com/@shamique/upload-an-image-to-s3-bucket-in-ionic-app-5dc96b772d48

Open Cognito service, click Manage Identity Pools, click the identity pool you just created, then
Click Edit identity pool on top right corner, copy and paste the identity pool id and to `environment/environment.ts`


```javascript
export const environment = {
  production: false,
  awsConfig: {
   bucketName: '******', 
   bucketRegion: 'us-east-1', 
   IdentityPoolId: 'us-east-1:**************************'
  },
};
```


### Step 4:
Create a directory called `storage` inside `src/app/`. Copy `aws-s3.service.ts` downloaded from our github to storage folder: https://github.com/StatisticalReinforcementLearningLab/SARAv2/blob/ADAPTSBranch/src/app/storage/aws-s3.service.ts


### Step 5:
Modify the contents of the `home.page.html` so that it looks like the following.


```html
<ion-header>
  <ion-toolbar>
    <ion-title>
      Use storage module
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <div class="ion-padding">
    <ion-button (click)="uploadToAWS()">Upload JSON to S3</ion-button> <br>
  </div>
</ion-content>
```

Modify the contents of the `home.page.ts`

```javascript
import { Component } from '@angular/core';
import { AwsS3Service } from '../storage/aws-s3.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  result;
  constructor(private awsS3Service: AwsS3Service) {
    this.result = {"Q1d":" School",
    "Q2d":" Sister(s)/Brother(s)",
    "Q3d":"0",
    "Q4d":"4",
    "Q5d":"0"};  
  }

  uploadToAWS(){
    this.awsS3Service.upload("Survey", this.result);
  }
}
```



### Step 6:
The code will automatically compile and the following page:

![image](https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/SARAv2/harvard/dev/src/app/storage/Picture2.png)


Click buton `UPLOAD JSON TO S3`, a JSON file will be loaded in the `Survey` sub-folder in the AWS bucket specified in aws config.

For encrypting survey data, can refer to file: `encrdecrservice.service.ts`
https://github.com/StatisticalReinforcementLearningLab/SARAv2/blob/ADAPTSBranch/src/app/storage/encrdecrservice.service.ts

and how it is used in:
https://github.com/StatisticalReinforcementLearningLab/SARAv2/blob/ADAPTSBranch/src/app/survey/dynamic-survey/dynamic-survey.component.ts






### Step 7:
See how to create a csv file from the uploaded folder in S3 [here](https://github.com/StatisticalReinforcementLearningLab/SARAv2/tree/harvard/dev/copy_these_files/aws_scripts)


