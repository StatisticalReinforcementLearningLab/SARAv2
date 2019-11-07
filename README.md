# SARAv2
Substance Abuse Research Assistant V2


# Project Description
SARA is a novel app to engage users with ongoing tracking using timely rewards thereby reinforcing users for data input. SARA is developed for adolescents and emerging adults at risk for substance abuse. The rewards in SARA are designed to be developmentally and culturally appropriate to the target demographic. For more details please check out the following paper or contact mrabbi@fas.harvard.edu

<p align="center">
  <img src="https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/sara/master/app_code/9850-169539-1-SP.png" width="650"/>
</p>

The code is divided into two folder. One folder contains the SARA mobile app code. The other folder contain the code to analyze the causal effect of the SARA app. If you want to cite our work then you can use the following two links:


For the SARA app:

```tex
@article{rabbi2018toward,
  title={Toward increasing engagement in substance use data collection: development of the Substance Abuse Research Assistant app and protocol for a microrandomized trial using adolescents and emerging adults},
  author={Rabbi, Mashfiqui and Kotov, Meredith Philyaw and Cunningham, Rebecca and Bonar, Erin E and Nahum-Shani, Inbal and Klasnja, Predrag and Walton, Maureen and Murphy, Susan},
  journal={JMIR research protocols},
  volume={7},
  number={7},
  year={2018},
  publisher={JMIR Publications Inc.}
}
```

If you are interested in causal inference with binary outcome in a time-varying setting then please cite:

```tex
The manuscript is in preparation. For an early draft, please contact
mrabbi@fas.harvard.edu or qiantianchen.thu@gmail.com 

For an informal description of the method see the "analysis_code" folder at the following link

https://github.com/StatisticalReinforcementLearningLab/SARA-Version1/tree/master/analysis_code.
```


# Code Description 
The following section needs update. But, we are using Angular 8 and ionic 4.  The code is modular and extendible. Descriptions of a few modules are below. We will add more details of these modules in a few weeks.




## Survey Module
The survey module deals with creating survey. The surveys are defined using a JSON formatted file and the "dynamic-survey.component.ts" file converts the JSON into visual form.

You can see the links to the JSON file and "dynamic-survey.component.ts" below. We also created a sample survey in the link "\app\survey\sample-survey\sample-survey.component.ts" and "\app\survey\sample-survey\sample-survey.component.html". The "sample-survey.component.html" shows the 'one line code' that you can change to point to the survey you want to populate from "\assets\data\" directory.

1. Survey questions are stored in "\assets\data\questions.json"
2. "\app\survey\dynamic-survey\dynamic-survey.component.ts" generates
survey, uses services in storage module to encrpt data and upload to
cloud.


## Storage Module
The storage module is responsible to encrypt the data and send it to the server. Currently, the encryption uses AES-256 and we can save to firebase, Azure and AWS s3. 

1. Configuration for firebase, Azure and AWS s3 are all stored in
"\environments\environment.ts"
2. Encrypt data service: encrdecrservice.service.ts.
3. Upload the encrypted data to AWS s3, Azure or Firebase:
aws-s3.service.ts, azure.service.ts or
store-to-firebase.service.ts
