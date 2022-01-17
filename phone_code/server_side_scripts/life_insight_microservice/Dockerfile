FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7
RUN apk --update add bash vim

RUN apk add --no-cache --update gcc gfortran musl-dev g++ 
 
ENV STATIC_URL /static
ENV STATIC_PATH /home/eura/fall2020/altair-scripts/app/static
COPY ./requirements.txt /var/www/altair-container/requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /var/www/altair-container/requirements.txt


COPY ./app.py /var/www/altair-container/app.py
COPY ./helper_functions.py /var/www/altair-container/helper_functions.py
COPY ./config/saraSqlConfig.json /var/www/altair-container/config/saraSqlConfig.json
COPY ./config/aws_config.json /var/www/altair-container/config/aws_config.json
WORKDIR /var/www/altair-container
EXPOSE 5100
ENTRYPOINT ["python"]
CMD ["app.py"]
