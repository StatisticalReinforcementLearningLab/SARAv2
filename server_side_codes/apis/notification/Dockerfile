FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7
RUN apk --update add bash vim gcc g++ python3-dev
MAINTAINER sarah_rathnam@g.harvard.edu
ENV STATIC_URL /static
ENV STATIC_PATH /var/www/app/static
COPY ./notification_flask.py /var/www/notification_flask.py
COPY ./notification_reqs.txt /var/www/notification_reqs.txt
COPY ./SendOneSignalNotification.py /var/www/SendOneSignalNotification.py
#copy mysql config from sara-python-package/sara/config/ into current folder if updated
COPY ./mysql_config.json /var/www/mysql_config.json
WORKDIR /var/www
RUN pip install -r notification_reqs.txt
CMD ["python","notification_flask.py"]
