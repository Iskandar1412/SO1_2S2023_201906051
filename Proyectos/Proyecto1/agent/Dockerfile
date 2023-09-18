FROM golang:latest

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos del componente al contenedor
COPY . .

# Ejecutar Archivo
RUN go build -o myapp

# Poner puerto salida
EXPOSE 3200

# Ejecutar app
CMD [ "./myapp" ]

# docker build -t app_proy1 .