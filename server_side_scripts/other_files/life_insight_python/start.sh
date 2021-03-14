#!/bin/bash
app="sara_sleep_rt_viz"
docker build -t ${app} .
docker run -d -p56734:80 --name=${app} ${app}
