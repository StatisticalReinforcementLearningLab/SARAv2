#!/bin/bash
app="notification"
docker build -t ${app} .
docker run -d -p 6000:6000\
  --name=${app} \
  -v $PWD:/app ${app}

