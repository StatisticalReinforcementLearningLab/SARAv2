#!/bin/bash
app="tailored_messaging"
docker build -t ${app} .
docker run -d -p 5002:80 --name=${app} ${app}