#!/bin/bash
app="life.insight.microservice"
docker build -t ${app} .
docker run -d -p 5100:5100 --name=${app}  -e AWS_ACCESS_KEY_ID=AKIA4HORFG5PTAOZGMWN -e AWS_SECRET_ACCESS_KEY=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 ${app}
