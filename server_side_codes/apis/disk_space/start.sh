#!/bin/bash
app="disk.space"
docker stop ${app}
docker rm ${app}
docker build --pull --no-cache -t ${app} .
docker run -d -p 5001:80 \
  --name=${app} \
  -v $PWD:/app ${app}
