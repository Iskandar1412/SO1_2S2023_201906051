From golang:1.21

WORKDIR /backend

COPY . .

RUN go build -o tarea4 .

EXPOSE 8000

CMD ["./tarea4"]

# sudo docker build -t app_tarea4 .
# sudo docker run -p 8000:8000 app_tarea4