FROM python:3.8

COPY ./requirements.txt /requirements.txt

WORKDIR /

RUN pip3 install -r requirements.txt

COPY . /

EXPOSE 5000

ENTRYPOINT ["python3"]

CMD ["app/app.py"]