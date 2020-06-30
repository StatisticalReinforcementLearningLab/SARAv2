### How to extract CSV files from JSON data stored in S3 


- Download and install python: https://www.python.org/downloads/

- Download and install npm: https://www.npmjs.com/get-npm

- Download python scripts : https://github.com/StatisticalReinforcementLearningLab/SARAv2/tree/AdaptsBranchV3/copy_these_files/aws_scripts

- copy files: getAYAData.py, decrypt.js,  getConfig.py to a folder in your computer (Let’s use pathToTheFolder to note the path to this folder).

- Follow comments in getConfig.py to create aws_config.json file and put in AWS configuration.

- You need to modify the header in getAYAData.py to names of variables you would like to track. (it would be `Q1d,Q2d,Q3d,Q4d` if you use [step 5 from this link](https://github.com/StatisticalReinforcementLearningLab/SARAv2/tree/harvard/dev/src/app/storage#step-5))

- You can comment out decrypt data code if your data is not encrypted.

- Open “command prompt” and use this command: `cd pathToTheFolder`  
- This command is to go to the folder where we just copy to your computer.

- Type the command in command prompt: `npm i crypto-js`.  This command is to install crypto-js package needed to encrypt survey data.

-  Type the command in command prompt: `py getAYAData.py`

- `survey_aya.csv` is generated in the same folder (you could edit `getAYAData.py` to change `survey_aya.csv` to other name if you prefer)




