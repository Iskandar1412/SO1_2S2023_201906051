FROM golang:alpine
WORKDIR /app
COPY . .
RUN go build -o myapp
EXPOSE 8000
CMD [ "./myapp" ]

# docker build -t app_golang .