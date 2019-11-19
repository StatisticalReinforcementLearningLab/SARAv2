# SARAv2
Substance Abuse Research Assistant V2


# Project Description
SARA is a mobile health app to engage participants with ongoing self-reporting (e.g., completing a daily survey) using timely rewards thereby reinforcing participants for data input. "SARA version 1" was initially developed for adolescents and emerging adults at high-risk of substance abuse, and the reinforcement strategies were developmentally and culturally appropriate for target population. SARA version 2 is extending version 1 in a number of important ways: (i) it is focusing on self-report-engagement problems for health issues faced by youth in general (e.g., younger adults with cancer). (ii) it is creating a modularized and open-source version so that other research groups can take the code and easily adapt the code for their own problem. (iii) it is focusing on developing reinforcement algorithms to develiver the right reinforcement at the right time so that people stay engaged.  

The current contributors of this project are Harvard University, University of Michigan, and Children Hospital of Philadelphia.

For more details, please check out the paper linked below or contact mrabbi@fas.harvard.edu

<p align="center">
  <img src="https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/sara/master/app_code/9850-169539-1-SP.png" width="650"/>
</p>

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
