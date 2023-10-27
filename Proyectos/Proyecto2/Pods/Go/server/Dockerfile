FROM golang:1.21.0

WORKDIR /server

COPY . .

RUN go build -o go-server .

EXPOSE 3256

CMD [ "./go-server" ]

# sudo docker build -t server-go .
# sudo docker run -p 3255:3255 server-go

# sudo docker build -t iskandar1412/server-go:v1 .
# sudo docker tag iskandar1412/server-go:v1 iskandar1412/server-go:v1
# sudo docker push iskandar1412/server-go:v1