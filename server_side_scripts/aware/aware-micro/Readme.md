
## ssh to server and get into the aware micro folder
---- 
The .pem file is excluded from github. Use our slack channel to ask for the pem file.

> - ssh -i ./HarvardDevSARA2020.pem ec2-user@ec2-52-201-144-36.compute-1.amazonaws.com
> - cd ~/aware


<br><br>
## Setting up aware micro
----
<br>

### Setup MySQL database
Aware micro uses MySQL 8 or 5.7. We will be use MySQL 8. MySQL recently started using a new authentication method that is different from past username/password login method. This is the current default method. However, aware micro doesn't support the new method and supports the old username/password method.

Fortunately, we can overridde the default setting of MySQL 8, and make it accept the old username/password login method. We need to add the line:  `command: --default-authentication-plugin=mysql_native_password`

The yml file will look like the following if you are using [docker for mysql](https://hub.docker.com/_/mysql).

```
  mysql-development:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: PASSWORD
      MYSQL_DATABASE: DATABASE_NAME
    ports:
      - "3308:3306"
```

We have a docker container that already does that
> cd ~/docker-mysql-main<br>
> docker-compose -f ./docker-compose.yml up&

Run `docker ps` to ensure that ` docker-mysql-main_mysql-development_1` is running on port 3308. 
<br><br>

### Setup aware-micro
 > CAUTION: When aware-mirco works it works. But, when it doesn't it behaves
unpredictably, and there is hardly any error message to debug what is going on. Mash has success with the following steps. 

Following steps sets up an aware micro-service using docker. 
<br><br><br>

#### **Step 1**
Go to the 'src' directory
> 1. ssh -i ./HarvardDevSARA2020.pem ec2-user@ec2-52-201-144-36.compute-1.amazonaws.com
> 2. cd ~/aware/aware-micro/
> 3. cp -r src aware-micro 
> 4. cd aware-micro
> 5. ./gradlew clean build shadowJar
> 6. cd build/libs
> 7. java -jar micro-1.0.0-SNAPSHOT-fat.jar

Note: 3 is a fresh copy of the aware code. The build command in 5 only works if we start from a fresh copy of the code.

Step 7 will create a file aware-config.json. Press CTRL+C to stop your server. You can edit this file to configure what database will be used and port, encryption and sensor & plugin settings for your study.
<br><br>

**Copy the `aware-micro.json` from the top level directory**

> 8. cp ~/aware/aware-micro/aware-config.json ./aware-config.json
> 9. screen
> 10. java -jar micro-1.0.0-SNAPSHOT-fat.jar

<br><br>
Open the following browser link:
> http://ec2-52-201-144-36.compute-1.amazonaws.com:8080

If you click the link you will be taken to a barcode page. 

#### Notes on `screen` command
For `screen` command in linux see [here](https://linuxize.com/post/how-to-use-linux-screen/). The useful commands are detach (Control+a d) and reattach `screen -r` and list screens `screen -ls`. Quitting `screen -ls` then `screen -XS [session # you want to quit] quit`. e.g., `screen -XS 20411 quit`

<br><br><br><br>

----
<br>
#### **Step 2 [Exclude this step. I couldn't get the microservice to work]**

Start the micro-service.

>mkdir micro_service<br>
>cd micro_service/<br>
>mv ../aware-micro/build/libs/micro-1.0.0-SNAPSHOT-fat.jar ./<br>
>mv ../aware-micro/build/libs/aware-config.json ./<br>