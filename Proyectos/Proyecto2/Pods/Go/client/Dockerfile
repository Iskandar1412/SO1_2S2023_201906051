FROM golang:1.21.0

WORKDIR /client

COPY . .

RUN go build -o go-client .

EXPOSE 3255

CMD [ "./go-client" ]

# sudo docker build -t client-go .
# sudo docker run -p 3255:3255 client-go

# sudo docker build -t iskandar1412/client-go:v1 .
# sudo docker tag iskandar1412/client-go:v1 iskandar1412/client-go:v1
# sudo docker push iskandar1412/client-go:v1