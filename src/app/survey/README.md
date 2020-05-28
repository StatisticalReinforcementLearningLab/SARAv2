## A brief intro to surveys in SARA
In SARA, self-reporting happens in the surveys. The survey quesitons are dependent on a domain scientist's research interests. The goal of SARA is to increase these surveys with incentives. <br />


## Key features of the survey module
- The survey module contains a survey generator which takes a JSON formatted questionaire and generates a survey. Typically, a domain scientist decides what questions they want to ask. 
- Once the JSON file in constructed, it is easy to create your own survey as a component/form by only specifying a link to the JSON survey (see description below on how to do it). <br />



## Technical details
The surveys are defined using a JSON formatted file. The `./dynamic-survey/dynamic-survey.component.ts` file converts the JSON into visual form.

We also created a sample survey in the link `./sample-survey/sample-survey.component.ts` 
and `./sample-survey/sample-survey.component.html`. The `sample-survey.component.html` shows 
the 'one line code' 

```html
<app-dynamic-survey fileLink="alex_survey"></app-dynamic-survey>
```

that you can change to point to the survey you want to populate from `/assets/data/` directory. `/assets/data/` contains samples of other surveys.<br />





#### Summary of important files in the survey module:
1. Survey questions are stored in `/assets/data/questionaire.json`
2. `./dynamic-survey/dynamic-survey.component.ts` generates survey, uses services in storage module to encrpt data and upload the data to the cloud.<br />




## In progress:
Add active tasks from version 1.
