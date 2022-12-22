FROM tiangolo/uwsgi-nginx-flask:python3.8-alpine
RUN apk --update add bash gcc g++ python3-dev
ENV STATIC_URL /static
ENV STATIC_PATH /var/www/app/static
COPY ./requirements.txt /var/www/requirements.txt
COPY ./cert.pem /app
COPY ./key.pem /app
RUN pip install --upgrade pip
RUN pip install -r /var/www/requirements.txt

EXPOSE 80
EXPOSE 443
