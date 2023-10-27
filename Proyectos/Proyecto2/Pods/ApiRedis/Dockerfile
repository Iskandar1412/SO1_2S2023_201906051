FROM python:3.10.12

WORKDIR /api-redis

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 7980

CMD ["python3", "api-redis.py"]


# pip freeze > requirements.txt
# sudo docker build -t iskandar1412/api-redis:v1 .
# sudo docker tag iskandar1412/api-redis:v1 iskandar1412/api-redis:v1
# sudo docker push iskandar1412/api-redis:v1