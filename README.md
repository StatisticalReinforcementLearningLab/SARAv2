# SARAv2

**Oct 17, 2022**: For code organization see this [wiki](https://github.com/StatisticalReinforcementLearningLab/SARAv2/wiki/SARA-version-2-code-organization-(10-16-2022))




# Project Description
SARA is a mobile health app to engage participants with ongoing self-reporting (e.g., completing a daily survey) using timely rewards thereby reinforcing participants for data input. [SARA version 1](https://github.com/StatisticalReinforcementLearningLab/SARA-Version1) was initially developed for adolescents and emerging adults at high-risk of substance abuse, and the reinforcement strategies were developmentally and culturally appropriate for target population. 


SARA version 2 is extending version 1 in a number of ways: (i) we are focusing on self-report-engagement problems for a range of health issues faced by youth. e.g., one project focuses on younger adults with cancer and we are using SARA to increase self-reports on factors related to medication adherence. (ii) we are creating a modularized and open-source version so that other research groups can take the code and easily adapt the code for their own research problems. (iii) we are focusing on developing and deploying reinforcement algorithms to develiver the right reward at the right time so that people stay engaged over extended period of time.  

The current contributors of this project are Harvard University, University of Michigan, and Children Hospital of Philadelphia.

For more details, please check out the paper linked below or contact mashfiqui.r.s@gmail.com

<p align="center">
  <img src="https://raw.githubusercontent.com/StatisticalReinforcementLearningLab/SARAv2/master/phone_code/all_level.png.PNG" width="100%"/>
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
The manuscript is in preparation. For an early draft, please refer to https://arxiv.org/abs/1906.00528 or contact
mrabbi@fas.harvard.edu or qiantianchen.thu@gmail.com 

For an informal description of the method see the "analysis_code" folder at the following link

https://github.com/StatisticalReinforcementLearningLab/SARA-Version1/tree/master/analysis_code.
```





# How to run this code 
SARA version 2 uses Angular 9 and ionic 5. Ionic is a cross-platform language written in Javascript. The ionic [starter project guideline](https://ionicframework.com/getting-started) is excellent and it is great point start.  

Once you get used the ionic starter project, you can clone our repo and all you need to do is type the following command. A new browser window will open up with SARA running.

```
ionic serve
```




# Code Description 
For code organization see this [wiki](https://github.com/StatisticalReinforcementLearningLab/SARAv2/wiki/SARA-version-2-code-organization-(10-16-2022))

Our code uses modules, components and service architecture from Angular 2 or above. For a tutorial of this type of architecture, we found [this Udemy course](https://www.udemy.com/course/the-complete-angular-master-class/) to be useful.  

### Folders with documents related to SARA
[Associated documents](https://www.dropbox.com/sh/pnxm4ajpkag743a/AAArpb5AH0I-6UECaYVLc8zla?dl=0) 
Now moved to [google doc folder](https://drive.google.com/drive/folders/1P9y5-P4gLJZPHvsxDyvy7hDSVuf9W6I0?usp=sharing)

# RL Algorithm Documentation
The documentation for the RL algorithm deployed on SARA version 2 can be found [here](https://hackmd.io/@NmVUyGhZTtGsYYlVWJx9uQ/BJangREBv).

