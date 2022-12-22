FROM tiangolo/uwsgi-nginx-flask:python3.8-alpine
RUN apk --update add bash vim gcc g++ python3-dev
MAINTAINER sarah_rathnam@g.harvard.edu
ENV STATIC_URL /static
ENV STATIC_PATH /var/www/app/static
RUN pip install --upgrade pip
RUN rm -rf /var/www/notification_flask.py
COPY ./notification_flask.py /var/www/notification_flask.py
RUN rm -rf /var/www/notification_reqs.txt
COPY ./notification_reqs.txt /var/www/notification_reqs.txt
RUN rm -rf /var/www/SendOneSignalNotification.py
COPY ./SendOneSignalNotification.py /var/www/SendOneSignalNotification.py
#copy mysql config from sara-python-package/sara/config/ into current folder if updated
RUN rm -rf /var/www/mysql_config.json
COPY ./mysql_config.json /var/www/mysql_config.json
#copy config.ini from main directory into current folder if updated
RUN rm -rf /var/www/config.ini
COPY ./config.ini /var/www/config.ini
WORKDIR /var/www
RUN pip install -r notification_reqs.txt
CMD ["python","notification_flask.py"]
