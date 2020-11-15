#!/bin/bash
app="sara.flask"
docker build -t ${app} .
docker run -d -p 5000:80\
  --name=${app} \
  -v $PWD:/app ${app}

