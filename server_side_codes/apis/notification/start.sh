#!/bin/bash
app="notification"
docker build --pull --no-cache -t ${app} .
docker run -d -p 6000:6000\
  --name=${app} \
  -v $PWD:/app ${app}

