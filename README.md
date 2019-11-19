# SARAv2
Substance Abuse Research Assistant V2


# Project Description
SARA is a mobile health app to engage participants with ongoing self-reporting (e.g., completing a daily survey) using timely rewards thereby reinforcing participants for data input. [SARA version 1](https://github.com/StatisticalReinforcementLearningLab/SARA-Version1) was initially developed for adolescents and emerging adults at high-risk of substance abuse, and the reinforcement strategies were developmentally and culturally appropriate for target population. 


SARA version 2 is extending version 1 in a number of ways: (i) we are focusing on self-report-engagement problems for a range of health issues faced by youth. e.g., one project focuses on younger adults with cancer and we are using SARA to increase self-reports on factors related to medication adherence. (ii) we are creating a modularized and open-source version so that other research groups can take the code and easily adapt the code for their own research problems. (iii) we are focusing on developing and deploying reinforcement algorithms to develiver the right reward at the right time so that people stay engaged over extended period of time.  

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





# How to run this code 
We are using Angular 8 and ionic 4 for this project. Ionic is easy to setup. The ionic [starter project guideline](https://ionicframework.com/getting-started) is excellent and it is great point start.  

Once you get used the ionic starter project, you can clone our repo and all you need to do is type the following command. A new browser window will open up with SARA running.

```
ionic serve
```




# Code Description 
SARA version 2 code is designed to be modular and extendible. The following diagram shows the different modules in SARA. Each module is described in detail in their respective readme files. 

<p align="center">
  <img src="https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/SARAv2/master/modular_sara.png" width="650"/>
</p>

Our code heavily uses modules, components and service architecture from Angular 2 or above. If you are new to this architecture, we found [this Udemy course](https://www.udemy.com/course/the-complete-angular-master-class/) to be very helpful.  





