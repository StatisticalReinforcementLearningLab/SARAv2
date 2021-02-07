import os
from datetime import datetime

now = datetime.now()
current_time = now.strftime("%H:%M:%S")

with open("/home/ec2-user/SARA_modular/SARA_H/cron_test.txt", "a") as myfile:
    myfile.write("appended text, at time " + current_time + "\n")