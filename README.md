# SARAv2
Substance Abuse Research Assistant V2


## Survey Module
The survey module deals with creating survey. The surveys are defined using a JSON formatted file and the "dynamic-survey.component.ts" file convers the JSON into visual form.

You can see the links to the JSON file and "dynamic-survey.component.ts" in the links below. We also created a sample survey in the link "\app\survey\sample-survey\sample-survey.component.ts" and "\app\survey\sample-survey\sample-survey.component.html". The "sample-survey.component.html" shows the one line code that you can change to point to the survey you want to populate from "\assets\data\" directory.

1. Survey questions are stored in "\assets\data\questions.json"
2. "\app\survey\dynamic-survey\dynamic-survey.component.ts" generates
survey, uses services in storage module to encrpt data and upload to
cloud.


## Storage Module
The storage module is response to encrypt the data and send it to the server. Currently, the encryption use AES-256 and we can save to firebase, Azure and AWS s3. 

1. Configuration for firebase, Azure and AWS s3 are all stored in
"\environments\environment.ts"
2. Encrypt data service: encrdecrservice.service.ts.
3. Upload the encrypted data to AWS s3, Azure or Firebase:
aws-s3.service.ts, azure.service.ts or
store-to-firebase.service.ts
