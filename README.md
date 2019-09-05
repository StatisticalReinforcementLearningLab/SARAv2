# SARAv2
Substance Abuse Research Assistant V2


## Survey Module
1. Survey questions are stored in "\assets\data\questions.json"
2. "\app\survey\dynamic-survey\dynamic-survey.component.ts" generates
survey, uses services in storage module to encrpt data and upload to
cloud.

## Storage Module
1. Configuration for firebase, Azure and AWS s3 are all stored in
"\environments\environment.ts"
2. Encrypt data service: encrdecrservice.service.ts.
3. Upload the encrypted data to AWS s3, Azure or Firebase:
aws-s3.service.ts, azure.service.ts or
store-to-firebase.service.ts
