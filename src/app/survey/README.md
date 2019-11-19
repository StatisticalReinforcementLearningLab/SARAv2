The survey module deals with creating survey. The surveys are defined using a JSON formatted 
file and the `dynamic-survey.component.ts` file converts the JSON into visual form.


You can see the links to the JSON file and `dynamic-survey.component.ts` below. 
We also created a sample survey in the link `\app\survey\sample-survey\sample-survey.component.ts` 
and `\app\survey\sample-survey\sample-survey.component.html`. The `sample-survey.component.html` shows 
the 'one line code' that you can change to point to the survey you want to populate from `\assets\data\` directory.


1. Survey questions are stored in `\assets\data\questions.json`
2. `\app\survey\dynamic-survey\dynamic-survey.component.ts` generates
survey, uses services in storage module to encrpt data and upload to
cloud.
