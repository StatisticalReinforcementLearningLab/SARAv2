FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7
RUN apk --update add bash nano
ENV STATIC_URL /static
ENV STATIC_PATH /var/www/app/static
COPY ./requirements.txt /var/www/requirements.txt
COPY ./config/saraSqlConfig.json /var/www/config/saraSqlConfig.json
COPY ./config/aws_config.json /var/www/config/aws_config.json
RUN pip install -r /var/www/requirements.txt
