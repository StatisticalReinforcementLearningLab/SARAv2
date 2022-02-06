#!/bin/bash

for file in dumpfiles/*.sql
do
    mysqldump -P 3308 -h ec2-54-165-102-180.compute-1.amazonaws.com -u root -p study < $file
done
