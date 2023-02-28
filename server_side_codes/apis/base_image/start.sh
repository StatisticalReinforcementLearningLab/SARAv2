#!/bin/bash
app="disk.space.v2"
docker build -t ${app} .
docker run -d -p 5001:80 \
  --name=${app} \
  -v $PWD:/app ${app}