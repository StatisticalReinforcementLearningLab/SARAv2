#!/bin/bash
app="user_registration"
docker build --pull --no-cache -t ${app} .
docker run -d -p 5000:80\
  --name=${app} \
  -v $PWD:/app\
    ${app}

