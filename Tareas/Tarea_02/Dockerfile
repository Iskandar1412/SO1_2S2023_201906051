# Version de go
FROM golang:1.21

# Directorio
WORKDIR /app

# Copiar contenido actual al directorio
COPY . .

# Compilar aplicación
RUN go build -o main .

# Puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD [ "./main" ]